import { OldWorldTest } from "./test";

export class ActionUse extends OldWorldTest 
{
    static subTemplate = "";
    static testTemplate = "systems/whtow/templates/chat/tests/action-use.hbs";


    static async fromAction(action, actor, context={})
    {
       let use = await new this({testData : {}, context : foundry.utils.mergeObject({
        actor : actor.uuid,
        rollMode: game.settings.get("core", "rollMode"),
        speaker : CONFIG.ChatMessage.documentClass.getSpeaker({actor}),
        action,
        subAction : context.subAction,
        messageId : null,
        opposedIds : {},
        targetSpeakers : game.user.targets.size ? Array.from(game.user.targets).map(t => t.actor.speakerData(t.document)) : (context.targets || []),
        rollClass : "ActionUse",
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



    async computeOpposedResult(test)
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