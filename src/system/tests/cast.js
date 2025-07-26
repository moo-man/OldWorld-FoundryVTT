import { OldWorldTest } from "./test";

export class CastingTest extends OldWorldTest
{

    static subTemplate = "systems/whtow/templates/chat/tests/cast.hbs";

    static _separateDialogData(data)
    {
        return foundry.utils.mergeObject(super._separateDialogData(data), {context : {preventOpposed : true, rollClass : "CastingTest"}});
    }

    computeResult()
    {
        super.computeResult(); 
        this.result.miscasts = this.result.dice.filter(i => i.miscast).length;
        
        this.result.potency = this.result.successes

        this.result.progress = (this.result.successes + (this.actor.system.magic.casting.progress || 0));

        if ((this.result.miscasts + this.actor.system.magic.miscasts) > this.actor.system.magic.level)
        {
            this.result.miscasted = true;
        }
    }

    // Track casting value on actor based on spell id
    async preRollOperations()
    {
        if (this.actor.system.magic.casting.lore != this.context.lore)
        {
            await this.actor.update({[`system.magic.casting`] : {progress: 0, lore : this.context.lore}})
        }
    }


    async postRollOperations()
    {
        await super.postRollOperations();

        // Add miscasts to actor, if already added previously, modify by differential
        if (this.result.miscastsAdded)
        {
            let diff = this.result.miscasts - this.result.miscastsAdded;
            this.actor.update({"system.magic.miscasts" : this.actor.system.magic.miscasts + diff})
        }
        else if (this.result.miscasts)
        {
            this.actor.update({"system.magic.miscasts" : this.actor.system.magic.miscasts + this.result.miscasts})
            this.result.miscastsAdded = this.result.miscasts;
        }   

        // Add miscasts to casting value on actor, if already added previously, modify by differential
        if (this.result.successesAdded && this.actor.system.magic.casting.lore == this.context.lore)
        {
            let diff = - this.result.successes - this.result.successesAdded;
            this.actor.update({[`system.magic.casting.progress`] : (this.actor.system.magic.casting.progress || 0) + diff})
        }
        else 
        {
            this.actor.update({[`system.magic.casting.progress`] : (this.actor.system.magic.casting.progress || 0) + this.result.successes})
            this.result.successesAdded = this.result.successes
        }

        // // Remove if successfully cast
        // if (this.result.casted)
        // {
        //     await this.actor.update({[`system.magic.casting.-=${this.spell.id}`] : null})
        // }
    }

    get spell()
    {
        return this.item;
    }

    get targetEffects()
    {
        return [];
    }

    get damageEffects()
    {
        return [];
    }

    get zoneEffects()
    {
        return [];
    }

    get showChatTest() 
    {
        return false;
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
            let result = await super._rollDice(dice, target, rerolls);

            for(let dice of result)
            {
                dice.miscast = dice.result == 9;
                dice.preventReroll = dice.miscast;
            }
            return result;
        }

        async reroll(label="Reroll", diceIndices=[], compute=true)
        {

            for(let index of diceIndices)
            {
                if (this.result.dice[index].result == 9)
                {
                    throw new Error("Cannot reroll Miscasts");
                }
            }
            return super.reroll(label, diceIndices, compute);
        }

//    /**
//     * Computes damage ontop of normal opposed test evaluation
//     * @inheritdoc
//     */
//     computeOpposedResult(test)
//     {
//         let result = super.computeOpposedResult(test);

//         if (result.success && result.computed)
//         {
//             result.damage = {
//                 value : this.weapon.system.damage.value + result.successes,
//                 ignoreArmour : this.weapon.system.damage.ignoreArmour
//             }
//         }

//         return result;
//     }
}