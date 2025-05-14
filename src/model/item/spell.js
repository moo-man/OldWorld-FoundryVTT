import { BaseItemModel } from "./components/base";

let fields = foundry.data.fields;
export class SpellModel extends BaseItemModel 
{
    static LOCALIZATION_PREFIXES = ["WH.Models.spell"]
    static defineSchema()
    {
        let schema = super.defineSchema();
        schema.cv = new fields.NumberField({min: 0});
        schema.target = new fields.StringField({})
        schema.range = new fields.StringField({});
        schema.duration = new fields.StringField({});
        return schema;
    }
}