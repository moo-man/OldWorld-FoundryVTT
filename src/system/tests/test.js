import { OldWorldOpposedMessageModel } from "../../model/message/opposed";

export class OldWorldTest extends WarhammerTestBase 
{
    // Subclasses can define their own template to add onto the main one
    static subTemplate = "";


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
            speaker : data.speaker,
            messageId : null,
            targetSpeakers : data.targets,
            opposedIds : {}, // map of token IDs to opposed message IDs
            rollClass : "WeaponTest"
        }, data.context)

        return {testData, context}
    }


    async roll()
    {
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
        this.result.succeeded = this.result.successes >= this.testData.target;
        this.result.dice = dice;
    }

    async sendToChat({newMessage=false}={})
    {

        let subTemplate 
        if (this.constructor.subTemplate)
        {
            subTemplate = await foundry.applications.handlebars.renderTemplate(this.subTemplate, this);
        }
        this.subTemplate = subTemplate
        let content = await foundry.applications.handlebars.renderTemplate("systems/whtow/templates/chat/tests/test.hbs", this);
        
        
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
            ChatMessage.create(chatData, {keepId: true});
        }
        else 
        {
            this.message.update({content, system : {...this}});
        }
    }

    async handleOpposed(message)
    {
        let targets = this.targetTokens;


        // Attacking
        if (targets.length != this.context.opposedIds.length)
        {
            let opposedIds = foundry.utils.deepClone(this.context.opposedIds);
            for(let target of targets)
            {
                if (!this.context.opposedIds[target.id])
                {
                    let message = await OldWorldOpposedMessageModel.createFromTest(this, target)
                    opposedIds[target.id] = message.id;
                }
            }
            this.update({"context.opposedIds" : opposedIds});
        }
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
            if (!d.success)
            {
                return index
            }
        });
        if (indices.length)
        {
            await this.reroll(game.i18n.localize("TOW.Glorious"), indices, compute);
        }
    }

    async grimReroll(compute=true)
    {
        let indices = this.result.dice.map((d, index) => {
            if (d.success)
            {
                return index
            }
        });

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
}