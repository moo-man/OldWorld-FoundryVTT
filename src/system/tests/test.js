import { OldWorldOpposedMessageModel } from "../../model/message/opposed";

export class OldWorldTest extends WarhammerTestBase 
{
    // Subclasses can define their own template to add onto the main one
    static subTemplate = "";
    static testTemplate = "systems/whtow/templates/chat/tests/test.hbs";


    constructor(data={})
    {
        super();
        this.testData = data.testData;
        this.context = data.context;
        this.result = data.result;
    }

    // Create a new test from dialog data
    static fromData(data)
    {
       return new this(this._separateDialogData(data)); 
    }

    static _separateDialogData(data)
    {
        let testData = {
            target : data.target,
            dice : data.dice += (data.bonus - data.penalty),
            state : data.state,
            rerolls : [] // 2D array
        };
        let context = foundry.utils.mergeObject({
            actor : data.actor.uuid,
            characteristic : data.characteristic,
            rollMode : data.rollMode,
            skill: data.skill,
            endeavour : data.endeavour || false,
            speaker : data.speaker,
            itemUuid : data.itemUuid,
            messageId : null,
            targetSpeakers : data.targets,
            opposedIds : {}, // map of token IDs to opposed message IDs
            rollClass : "OldWorldTest"
        }, data.context)

        return {testData, context}
    }


    async roll()
    {
        await this.preRollOperations();
        this.result = {
            rerolls : []
        };
        this.result.initialDice = (await this._rollDice(this.testData.dice, this.testData.target)).sort((a, b) => {
            let aResult = a.result == 0 ? 10 : a.result;
            let bResult = b.result == 0 ? 10 : b.result;
            return aResult - bResult;
        })

        this.result.dice = this.result.initialDice;

        
        if (this.testData.state == "glorious")
        {
            await this.gloriousReroll(false);
        }
        else if (this.testData.state == "grim")
        {
            await this.grimReroll(false);
        }
        this.computeResult();
        await this.postRollOperations();
    }


    
    /**
     * 
     * @param {Number} dice Number of dice rolled
     * @param {Number} target Target number for each dice
     * @param {Array} rerolls Indices of any dice that are rerolls, if empty, all dice are active, if contains numbers, only dice with at those indices are being rerolled
     * @returns 
     */
    async _rollDice(dice, target, rerolls=[])
    {
        let roll = await new Roll(`${dice}d10cs<=${target}`).roll();
        let result = roll.dice[0].results.map((d, index) => {
            return {
                success: d.success,
                result: d.result,
                active : rerolls.length ? rerolls.includes(index) : true
            }
        })
        result.forEach(d => d.result = (d.result == 10 ? 0 : d.result)); // Replace 10s with 0s as shown on physical dice

        return result;
    }

    computeResult()
    {
        let dice = this._getActiveDice();
        this.result.successes = dice.filter(i => i.success).length
        this.result.failures = dice.filter(i => !i.success).length;
        this.result.succeeded = this.result.successes >= 1;
        this.result.dice = dice;
    }


    // Perform any updates based on test result
    async postRollOperations()
    {
        if (this.context.endeavour)
        {
            await this.actor.update({[`system.skills.${this.skill}`] : {improvement : this.actor.system.skills[this.skill].improvement + this.result.failures}});
        }
    }

    // Perform any updates before the roll is performed
    async preRollOperations()
    {

    }
    


    async sendToChat({newMessage=false}={})
    {

        let subTemplate 
        if (this.constructor.subTemplate)
        {
            subTemplate = await foundry.applications.handlebars.renderTemplate(this.constructor.subTemplate, this);
        }
        this.subTemplate = subTemplate
        if (this.item)
        {
            this.itemSummary = await this.formatItemSummary()
        }
        let content = await foundry.applications.handlebars.renderTemplate(this.constructor.testTemplate, this);
        
        if (!this.message || newMessage)
        {
            let id = foundry.utils.randomID();
            this.context.messageId = id;
            let chatData = {
                _id : id,
                type : "test",
                system : {...this},
                content,
                speaker : this.context.speaker
            }
            ChatMessage.create(ChatMessage.applyRollMode(chatData, this.context.rollMode), {keepId: true});
        }
        else 
        {
            this.message.update({content, system : {...this}});
        }
    }

    async formatItemSummary()
    {
        let item = this.item;
        let enriched = {
            public : await foundry.applications.ux.TextEditor.enrichHTML(item.system.description.public, {async: true, relativeTo: item, secrets : false}),
            gm : await foundry.applications.ux.TextEditor.enrichHTML(item.system.description.gm, {async: true, relativeTo: item, secrets : false})
        }
        return await foundry.applications.handlebars.renderTemplate("systems/whtow/templates/chat/item-summary.hbs", {noImage : item.img == "icons/svg/item-bag.svg", enriched, item });
    }


    /**
     * Checks targets and creates opposed messages for any targets that don't have them
     */
    async handleOpposed()
    {
        let targets = this.targetTokens;

        let opposedIds = foundry.utils.deepClone(this.context.opposedIds);

        // For each target, if no opposed test has been created, create one
        // If already created, rerender the message
        for(let target of targets)
        {
            if (!opposedIds[target.id])
            {
                let message = await OldWorldOpposedMessageModel.createFromTest(this, target)
                opposedIds[target.id] = message.id;
            }
            else 
            {
                let message = game.messages.get(opposedIds[target.id])
                if (message)
                {
                    message.system.renderResult(true);
                }
            }
        }
        this.update({"context.opposedIds" : opposedIds});        
    }


    /** 
     * Retrieves the opposed test handler message and sets the provided test as defending
     * 
     * @param {OldWorldTest} test Defending test
     */
    registerOpposedResponse(test)
    {
        game.messages.get(this.context.opposedIds[test.context.speaker.token])?.system.registerResponse(test);
    }


    /**
     * Compute opposed test result with defending test
     * 
     * @param {OldWorldTest} test Test defending against this test, undefined if unopposed
     */
    computeOpposedResult(test)
    {
        let successes // Opposing test successes

        // Unopposed
        if (!test)
        {
            successes = 0;
        }
        else 
        {
            successes = test.result.successes;
        }
        let opposed = {
            outcome : this.result.successes >= successes ? "success" : "failure",
            successes : this.result.successes - successes,
            success : this.result.successes >= successes,
            description : "",
            unopposed : !test,
            computed : true
        }

        // If the result of THIS test is 0 successes, that means both tests had 0, no one wins
        if (opposed.success)
        {
            if (this.result.successes == 0)
            {
                opposed.outcome = "tie"
                opposed.description = "TOW.Chat.Tie"
            }
            else 
            {
                // difference of 0 is considered marginal success
                if (opposed.successes <= 1)
                {
                    opposed.description = "TOW.Chat.MarginalSuccesss"
                }
                else if (opposed.successes == 2)
                {
                    opposed.description = "TOW.Chat.Success"
                }
                else if (opposed.successes >= 3)
                {
                    opposed.description = "TOW.Chat.TotalSuccess"
                }

            }
        }
        else 
        {
            opposed.description = "TOW.Chat.Failure"
        }

        return opposed;
    }

    update(data)
    {
        this.message.update({system : data}).then(foundry.utils.mergeObject(this, data));
    }

    /**
     * Rerolls are done by rerolling the entire set of dice, but marking only the ones being rerolled as active
     * Then, to get all dice that should be used in compute, start with original dice roll, then go through each roll
     * and replace each index with the reroll if it should be replaced.
     */
    _getActiveDice()
    {
        let activeDice = foundry.utils.deepClone(this.result.initialDice);
        for(let i = 0; i < activeDice.length; i++)
        {
            for(let reroll of this.result.rerolls)
            {
                if (reroll.dice[i].active)
                {
                    activeDice[i] = reroll.dice[i];
                    activeDice[i].rerolled = true;
                }
            }
        }
        return activeDice;

    }

    async reroll(label="Reroll", diceIndices=[], compute=true)
    {
        this.result.rerolls.push({label, dice : await this._rollDice(this.testData.dice, this.testData.target, diceIndices)});
        if (compute)
        {
            this.computeResult();
            this.sendToChat();
        }
    }

    async gloriousReroll(compute=true)
    {
        let indices = this.result.dice.map((d, index) => {
            if (!d.success && !d.preventReroll)
            {
                return index
            }
        }).filter(i => !isNaN(i));
        if (indices.length)
        {
            await this.reroll(game.i18n.localize("TOW.Glorious"), indices, compute);
        }
    }

    async grimReroll(compute=true)
    {
        let indices = this.result.dice.map((d, index) => {
            if (d.success && !d.preventReroll)
            {
                return index
            }
        }).filter(i => !isNaN(i));

        if (indices.length)
        {
            await this.reroll(game.i18n.localize("TOW.Grim"), indices, compute);
        }
    }

    get succeeded() {
        return this.result.succeeded;
    }

    get failed() {
        return !this.succeeded;
    }

    get message() {
        return game.messages.get(this.context.messageId);
    }

    get actor()
    {
        return ChatMessage.getSpeakerActor(this.context.speaker);
    }

    get skill() 
    {
        return this.context.skill;
    }

    get token()
    {
        return this.actor.getActiveTokens()[0]?.document
    }

    get targets() 
    {
        return this.context.targetSpeakers.map(i => ChatMessage.getSpeakerActor(i))
    }

    get targetTokens() 
    {
        return this.targets.map(i => i.getActiveTokens()[0]?.document);
    }

    get defendingAgainst()
    {
        return game.messages.get(this.context.defending)?.system.test;
    }

    // If defending, get the opposed message handling the result
    get opposedMessage()
    {
        return game.messages.get(this.defendingAgainst?.context.opposedIds[this.context.speaker.token])
    }

    get item()
    {
        return fromUuidSync(this.context.itemUuid);
    }

    get showChatTest()
    {
        return (this.item && !this.item.system.test?.self && this.item.system.test.skill) && !this.item.effects.contents.some(e => e.system.transferData.avoidTest.value == "item");
    }
}