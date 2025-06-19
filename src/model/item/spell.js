import { BaseItemModel } from "./components/base";

let fields = foundry.data.fields;
export class SpellModel extends BaseItemModel 
{
    static LOCALIZATION_PREFIXES = ["WH.Models.spell"]
    static defineSchema()
    {
        let schema = super.defineSchema();
        schema.cv = new fields.NumberField({min: 0});
        schema.successes = new fields.NumberField({min: 0});
        schema.lore = new fields.StringField({});
        schema.target = new fields.SchemaField({
            custom : new fields.StringField({}),
            value : new fields.StringField({})
        });
        schema.range = new fields.SchemaField({
            custom : new fields.StringField({}),
            value : new fields.StringField({})
        });
        schema.duration = new fields.SchemaField({
            custom : new fields.StringField({}),
            value : new fields.StringField({})
        });
        schema.damage = new fields.SchemaField({
            formula: new fields.StringField(),
            potency : new fields.BooleanField()
        })
        return schema;
    }
}