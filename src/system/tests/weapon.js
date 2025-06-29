import { OldWorldTest } from "./test";

export class WeaponTest extends OldWorldTest
{

    static _separateDialogData(data)
    {
        return foundry.utils.mergeObject(super._separateDialogData(data), {context : {rollClass : "WeaponTest"}});
    }

    computeResult()
    {
        super.computeResult();
        // let dice = this._getActiveDice();
        // this.result.successes = dice.filter(i => i.success).length
        // this.result.succeeded = this.result.successes >= this.testData.target;
        // this.result.dice = dice;
    }

    get weapon()
    {
        return this.item;
    }

   /**
    * Computes damage ontop of normal opposed test evaluation
    * @inheritdoc
    */
    computeOpposedResult(test)
    {
        let result = super.computeOpposedResult(test);

        if (result.success && result.computed)
        {
            result.damage = {
                value : this.weapon.system.damage.value + result.successes,
                ignoreArmour : this.weapon.system.damage.ignoreArmour
            }
        }

        return result;
    }
}