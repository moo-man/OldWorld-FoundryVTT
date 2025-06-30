import { BaseItemModel } from "./components/base";
import { TestModel } from "./components/test";
let fields = foundry.data.fields;

export class TalentModel extends BaseItemModel 
{
    static LOCALIZATION_PREFIXES = ["WH.Models.talent"]
    static defineSchema()
    {
        let schema = super.defineSchema();
        schema.cost = new fields.NumberField({min: 0});
        schema.requirement = new fields.SchemaField({
            text : new fields.StringField({}),
            script : new fields.JavaScriptField({})
        })
        schema.test = new fields.EmbeddedDataField(TestModel);
        return schema;
    }
}