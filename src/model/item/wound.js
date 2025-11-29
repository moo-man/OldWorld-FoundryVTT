import { BaseItemModel } from "./components/base";
let fields = foundry.data.fields;
export class WoundModel extends BaseItemModel 
{
    static LOCALIZATION_PREFIXES = ["WH.Models.wound"]

    static defineSchema()
    {
        let schema = super.defineSchema();
        schema.healing = new fields.NumberField({initial : 1, choices : game.oldworld.config.woundHealing});
        schema.treated = new fields.BooleanField();
        return schema;
    }

    async _preCreate(data, options, user)
    {
        await super._preCreate(data, options, user);
        if (this.parent.isOwned && this.parent.actor.system.hasThresholds)
        {
            let actor = this.parent.actor;

            if (actor.system.wounds.current == "defeated")
            {
                return
            }

            let currentThreshold = actor.system.wounds.current;
            let nextThreshold = actor.system.thresholdAtWounds(actor.itemTypes.wound.length + 1)

            if (currentThreshold != "defeated" && nextThreshold != currentThreshold)
            {
                actor.system.wounds[nextThreshold].effect?.document?.handleImmediateScripts(data, options, user)
            }
        }
    }

}