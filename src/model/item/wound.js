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

}