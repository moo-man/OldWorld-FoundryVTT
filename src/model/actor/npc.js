import { StandardActorModel } from "./standard";
let fields = foundry.data.fields;

export class NPCModel extends StandardActorModel 
{
    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.brackets = new fields.TypedObjectField(new fields.SchemaField({
            range : new fields.ArrayField(new fields.NumberField()),
            defeated : new fields.BooleanField(),
            effect : new fields.EmbeddedDataField(DocumentReferenceModel)
        }))

        schema.resilience.fields.useItems = new fields.BooleanField({}, {parent : schema.resilience});
        schema.resilience.fields.descriptor = new fields.StringField({}, {parent : schema.resilience});
        return schema;
    }

    computeBase() 
    {
        for(let c in Object.values(this.characteristics))
        {
            c.advances = 0;
        }
        for(let s in Object.values(this.skills))
        {
            s.advances = 0;
        }

        super.computeBase();

        // this.activeBracket = 
    }

}

