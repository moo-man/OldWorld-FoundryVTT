import { ItemUse } from "./item-use";

export class BlessingUse extends ItemUse 
{
    
    // Create a new test from dialog data
    static async fromItem(item, type, actor, context)
    {
        if (!actor)
        {
            actor = item.actor;
        }
        context.blessingType = type;
        await super.fromItem(item, actor, context)
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

    async formatItemSummary()
    {
        let item = this.item;
        let enriched = {
            public : ""
        }
        let name;

        if (this.context.blessingType == "favour")
        {
            enriched.public = await foundry.applications.ux.TextEditor.enrichHTML(item.system.favour.description, {async: true, relativeTo: item, secrets : false});
            name = game.i18n.format("TOW.Chat.FavouredBy", {name : item.name});
        }
        else if (this.context.blessingType == "prayer")
        {
            enriched.public = await foundry.applications.ux.TextEditor.enrichHTML(item.system.prayers.list[this.context.index].description, {async: true, relativeTo: item, secrets : false});
            name = item.system.prayers.list[this.context.index].name;
        }
        else if (this.context.blessingType == "miracle")
        {
            enriched.public = await foundry.applications.ux.TextEditor.enrichHTML(item.system.miracles.description, {async: true, relativeTo: item, secrets : false});
            name = game.i18n.format("TOW.Chat.MiracleOf", {name : item.name});
        }

        return await renderTemplate("systems/whtow/templates/chat/item-summary.hbs", {noImage : item.img == "icons/svg/item-bag.svg", enriched, item, name, expanded : true});
    }


    // Perform any updates based on test result
    async postRollOperations()
    {
        if (this.context.blessingType == "miracle")
        {
            this.item.update({"system.miracles.used" : true});
        }
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

    get showChatTest()
    {
        return false;//(this.item && !this.item.system.test?.self && this.item.system.test.skill) && !this.item.effects.contents.some(e => e.system.transferData.avoidTest.value == "item");
    }

    get targetEffects()
    {
        let effect;
        if (this.context.blessingType == "favour")
        {
            effect = this.item.system.favour.effect.document;
        }
        else if (this.context.blessingType == "prayer")
        {
            effect = this.item.system.prayers.list[this.context.index]?.effect.document;
        }

        if (effect && (effect.system.transferData.type == "target" || (effect.system.transferData.type == "zone" && effect.system.transferData.zone.transferred)))
        {
            return [effect];
        }
        else return [];
    }

    get zoneEffects()
    {
        let effect;
        if (this.context.blessingType == "favour")
        {
            effect = this.item.system.favour.effect.document;
        }
        else if (this.context.blessingType == "prayer")
        {
            effect = this.item.system.prayers.list[this.context.index]?.effect.document;
        }

        if (effect && effect.system.transferData.type == "zone" && effect.system.transferData.zone.type != "follow")
        {
            return [effect];
        }
        else return [];
    }


}