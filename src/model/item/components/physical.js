import { BaseItemModel } from "./base";
let fields = foundry.data.fields;

export class PhysicalItem extends BaseItemModel 
{
    static defineSchema()
    {
        let schema = super.defineSchema();
        schema.cost = new fields.StringField({choices : foundry.utils.mergeObject({"" : "-"}, game.oldworld.config.status), blank: true, initial : ""})
        schema.quantity = new fields.NumberField({})
        return schema;
    }

    get isPhysical()
    {
        return true;
    }
}