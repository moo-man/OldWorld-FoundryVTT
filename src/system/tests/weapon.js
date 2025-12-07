import { OldWorldTest } from "./test";

export class WeaponTest extends OldWorldTest
{

    static _separateDialogData(data)
    {
        let separated = super._separateDialogData(data);
        separated.testData.damage = data.damage;
        separated.context.charging = data.charging;

        return foundry.utils.mergeObject(separated, {context : {rollClass : "WeaponTest"}});
    }

    computeResult()
    {
        super.computeResult();
        // let dice = this._getActiveDice();
        // this.result.successes = dice.filter(i => i.success).length
        // this.result.succeeded = this.result.successes >= this.testData.target;
        // this.result.dice = dice;
    }

    async postRollOperations()
    {
        await super.postRollOperations();
        if (this.weapon.system.requiresLoading && !this.weapon.system.reload.optional)
        {
            await this.weapon.update({"system.reload.current" : 0});
        }
    }
    

    get weapon()
    {
        return this.item;
    }

   /**
    * Computes damage ontop of normal opposed test evaluation
    * @inheritdoc
    */
    async computeOpposedResult(test)
    {
        let result = await super.computeOpposedResult(test);

        if (this.weapon.system.isMelee && !result.success && !this.actor.hasCondition("staggered"))
        {
            this.actor.addCondition("staggered");
        }

        return result;
    }


    computeOpposedDamage(result, test)
    {
        return {
            value : this.testData.damage + (this.weapon.system.damage.successes ? result.successes : 0),
            ignoreArmour : this.weapon.system.damage.ignoreArmour,
        }
    }
}

