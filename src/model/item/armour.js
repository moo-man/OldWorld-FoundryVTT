import { PhysicalItem } from "./components/physical";
let fields = foundry.data.fields;

export class ArmourModel extends PhysicalItem 
{
    static LOCALIZATION_PREFIXES = ["WH.Models.armour"]
    static defineSchema()
    {
        let schema = super.defineSchema();
        schema.resilience = new fields.StringField({});
        schema.traits = new fields.StringField({});
        return schema;
    }


}