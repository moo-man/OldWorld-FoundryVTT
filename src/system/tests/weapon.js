import { OldWorldTest } from "./test";

export class WeaponTest extends OldWorldTest
{

    subTemplate = "";

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

    }

    get item()
    {

    }
}