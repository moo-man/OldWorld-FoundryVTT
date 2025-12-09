import { OldWorldTest } from "./test";

export class AbilityAttackTest extends OldWorldTest
{

    static _separateDialogData(data)
    {
        let separated = super._separateDialogData(data);
        separated.testData.damage = data.damage;
        separated.context.charging = data.charging;

        return foundry.utils.mergeObject(separated, {context : {rollClass : "AbilityAttackTest"}});
    }

    computeResult()
    {
        super.computeResult();
    }
    

    get ability()
    {
        return this.item;
    }

    get attack()
    {
        return true;
    }

   /**
    * Computes damage ontop of normal opposed test evaluation
    * @inheritdoc
    */
    async computeOpposedResult(test)
    {
        let result = await super.computeOpposedResult(test);

        if (this.ability.system.isMelee && !result.success && !this.actor.hasCondition("staggered"))
        {
            this.actor.addCondition("staggered");
        }

        return result;
    }

    
    computeOpposedDamage(result, test)
    {
        return {
            value : this.testData.damage + (this.ability.system.damage.successes ? result.successes : 0),
            ignoreArmour : this.ability.system.damage.ignoreArmour,
            excludeStaggeredOptions : this.ability.system.damage.excludedOptions.concat(this.testData.excludeStaggeredOptions)
        }
    }
}
