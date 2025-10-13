export class OldWorldEffect extends WarhammerActiveEffect
{

    static CONFIGURATION = {
        zone : true,
        exclude : {},
        bracket : ["(", ")"]
    };

    async resistEffect()
    {
        let result = await super.resistEffect();
        if (result === false || result === true)
        {
            return result;
        }

        let transferData = this.system.transferData;

        let test;
        let options = {appendTitle : " - " + this.name, resist : [this.key].concat(this.sourceTest?.item?.type || []), resistingTest : this.sourceTest, fields: {}};
        if (this.sourceTest && this.sourceTest.result?.test)
        {
            // transferData.avoidTest.dn = this.sourceTest.result.test.dn;
        }
        if (transferData.avoidTest.value == "item")
        {
            test = await this.actor.setupTestFromItem(this.item, options);
        }
        else if (transferData.avoidTest.value == "custom")
        {
            test = await this.actor.setupTestFromData(transferData.avoidTest, options);
        }

        if (!transferData.avoidTest.reversed)
        {
            // If the avoid test is marked as opposed, it has to win, not just succeed
            if (transferData.avoidTest.opposed && this.sourceTest)
            {
                return test.result.successes > this.sourceTest.result.successes;
            }
            else 
            {
                return test.succeeded;
            }
        }
        else  // Reversed - Failure removes the effect
        {
            // If the avoid test is marked as opposed, it has to win, not just succeed
            if (transferData.avoidTest.opposed && this.sourceTest)
            {
                return test.result.successes < this.sourceTest.result.successes;
            }
            else 
            {
                return test.result.failed;
            }
        }
    }


    prepareBaseData()
    {
        if (this.parent?.documentName == "Actor" && this.parent.system.hasThresholds)
        {
            if (!this.parent.system.effectIsActive(this))
            {
                this.disabled = true;
            }
        }
    }
        
    get testDisplay() 
    {
        let avoidTest = this.system.transferData.avoidTest;

        if (avoidTest.value == "custom")
        {
            if (avoidTest.skill)
            {
                return game.oldworld.config.skills[avoidTest.skill] + (avoidTest.dice ? ` (${(avoidTest.dice > 0 ? "+" : "")}${avoidTest.dice})` : "")  + " Test"
            }
            else 
            {
                return ""
            }
        }
        else if (avoidTest.value == "item")
        {
            return this.item.system.test.label;
        }
    }
}
