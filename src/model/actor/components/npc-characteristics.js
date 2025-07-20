let fields = foundry.data.fields;

export class NPCCharacteristicsModel extends foundry.abstract.DataModel 
{
    static defineSchema() 
    {
        let schema = {};
        schema.ws = new fields.SchemaField({
            base: new fields.NumberField({initial : 2}),
            modifier : new fields.NumberField({initial : 0})
        });
        schema.bs = new fields.SchemaField({
            base: new fields.NumberField({initial : 2}),
            modifier : new fields.NumberField({initial : 0})
        });
        schema.s = new fields.SchemaField({
            base: new fields.NumberField({initial : 2}),
            modifier : new fields.NumberField({initial : 0})
        });
        schema.t = new fields.SchemaField({
            base: new fields.NumberField({initial : 2}),
            modifier : new fields.NumberField({initial : 0})
        });
        schema.i = new fields.SchemaField({
            base: new fields.NumberField({initial : 2}),
            modifier : new fields.NumberField({initial : 0})
        });
        schema.ag = new fields.SchemaField({
            base: new fields.NumberField({initial : 2}),
            modifier : new fields.NumberField({initial : 0})
        });
        schema.re = new fields.SchemaField({
            base: new fields.NumberField({initial : 2}),
            modifier : new fields.NumberField({initial : 0})
        });
        schema.fel = new fields.SchemaField({
            base: new fields.NumberField({initial : 2}),
            modifier : new fields.NumberField({initial : 0})
        });
        return schema;
    }


    compute() 
    {
        for(let characteristic of Object.values(this))
        {
            characteristic.value = characteristic.base + characteristic.modifier;
        }
    }
}