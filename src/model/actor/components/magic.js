let fields = foundry.data.fields;

export class MagicDataModel extends foundry.abstract.DataModel 
{
    static defineSchema() 
    {
        let schema = {};
        schema.level = new fields.NumberField({initial: 0, min: 0})
        schema.miscasts = new fields.NumberField({min: 0})
        schema.casting = new fields.SchemaField({
            progress : new fields.NumberField({initial : 0, min: 0}),
            lore : new fields.StringField({})
        })
        return schema;
    }
}