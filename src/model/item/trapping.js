import { PhysicalItem } from "./components/physical";
import { TestModel } from "./components/test";

export class TrappingModel extends PhysicalItem 
{
    static defineSchema()
    {
        let schema = super.defineSchema();
        schema.test = new foundry.data.fields.EmbeddedDataField(TestModel);
        return schema;
    }


}