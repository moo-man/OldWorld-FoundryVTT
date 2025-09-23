import { OldWorldTest } from "./test";

export class WeaponTest extends OldWorldTest
{

    static _separateDialogData(data)
    {
        let separated = super._separateDialogData(data);
        separated.testData.damage = data.damage;

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
                value : this.testData.damage + result.successes,
                ignoreArmour : this.weapon.system.damage.ignoreArmour
            }
        }

        return result;
    }
}