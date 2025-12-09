import { PhysicalItem } from "./physical";

let fields = foundry.data.fields;

export class EquippableItem extends PhysicalItem 
{
    static defineSchema()
    {
        let schema = super.defineSchema();
        schema.equipped = new fields.SchemaField({
            value : new fields.BooleanField()
        })
        return schema;
    }

    get isEquipped()
    {
        return this.equipped.value;
    }

    get isEquippable() 
    {
        return true;
    }

    shouldTransferEffect(effect)
    {
        return super.shouldTransferEffect(effect) && (!effect.system.transferData.equipTransfer || this.isEquipped)
    }
}