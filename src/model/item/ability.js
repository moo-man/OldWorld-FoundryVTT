import { BaseItemModel } from "./components/base";
import { DamageModel } from "./components/damage";
import { TestModel } from "./components/test";
let fields = foundry.data.fields;

export class AbilityModel extends BaseItemModel 
{
    static LOCALIZATION_PREFIXES = ["WH.Models.ability"]
    static defineSchema()
    {
        let schema = super.defineSchema();
        schema.test = new fields.EmbeddedDataField(TestModel);
        schema.damage = new fields.EmbeddedDataField(DamageModel);
        return schema;
    }
}