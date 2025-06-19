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
}
