import { BaseItemModel } from "./components/base";
let fields = foundry.data.fields;

export class LoreModel extends BaseItemModel 
{
    static LOCALIZATION_PREFIXES = ["WH.Models.lore"]
    static defineSchema()
    {
        let schema = super.defineSchema();
        schema.category  = new fields.StringField();
        return schema;
    }
}