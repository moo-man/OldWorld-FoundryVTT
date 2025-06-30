import { PhysicalItem } from "./components/physical";
import { TestModel } from "./components/test";
let fields = foundry.data.fields;

export class ToolKitModel extends PhysicalItem 
{
    static LOCALIZATION_PREFIXES = ["WH.Models.toolKit"]
    static defineSchema()
    {
        let schema = super.defineSchema();
        schema.tests = new fields.StringField({});
        schema.lore = new fields.StringField({});
        schema.test = new fields.EmbeddedDataField(TestModel);
        return schema;
    }


}