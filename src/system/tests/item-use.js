import { OldWorldTest } from "./test";

export class ItemUse extends OldWorldTest 
{
    // Subclasses can define their own template to add onto the main one
    static subTemplate = "";
    static testTemplate = "systems/whtow/templates/chat/tests/item-use.hbs";


    
    // Create a new test from dialog data
    static async fromItem(item, actor, context)
    {
        if (!actor)
        {
            actor = item.actor;
        }
       let use = await new this({testData : {}, context : foundry.utils.mergeObject({
        actor : actor.uuid,
        rollMode: game.settings.get("core", "rollMode"),
        speaker : CONFIG.ChatMessage.documentClass.getSpeaker({actor}),
        itemUuid : item.uuid,
        messageId : null,
        opposedIds : {},
        targetSpeakers : game.user.targets.size ? Array.from(game.user.targets).map(t => t.actor.speakerData(t.document)) : (context.targets || []),
        rollClass : "ItemUse",
        preventOpposed : true
       }, context)}); 

       await use.roll();
       use.sendToChat();
    }


    async roll()
    {
        await this.preRollOperations();
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

    }

    computeResult()
    {
        this.result = {};
        let damage = 0;
        if (this.item.system?.damage?.formula)
        {
            damage = Roll.safeEval(Roll.replaceFormulaData(this.item.system.damage.formula, this.actor))
        }
        if (this.item.system.damage.potency)
        {
            damage += (this.context.potency || 0);
        }
        this.result.damage = {
            value : damage
        }
    }


    // Perform any updates based on test result
    async postRollOperations()
    {

    }

    // Perform any updates before the roll is performed
    async preRollOperations()
    {

    }
    

    registerOpposedResponse(test)
    {
    }



    computeOpposedResult(test)
    {
       
    }


    _getActiveDice()
    {
      

    }

    async reroll()
    {
    }

    async gloriousReroll()
    {
       
    }

    async grimReroll()
    {
      
    }

    get succeeded() {
    }

    get failed() {
    }


    get defendingAgainst()
    {
    }

    // If defending, get the opposed message handling the result
    get opposedMessage()
    {
    }

}