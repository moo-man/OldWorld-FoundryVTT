export class OldWorldEffect extends WarhammerActiveEffect
{

    static CONFIGURATION = {
        zones : true,
        exclude : {}
    };

    async resistEffect()
    {
        let actor = this.actor;

        // If no owning actor, no test can be done
        if (!actor)
        {
            return false;
        }

        let transferData = this.system.transferData;

        // If no test, cannot be avoided
        if (transferData.avoidTest.value == "none")
        {
            return false;
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
