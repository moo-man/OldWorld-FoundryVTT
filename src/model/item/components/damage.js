let fields = foundry.data.fields;
export class DamageModel extends foundry.abstract.DataModel 
{
    static defineSchema() 
    {
        let schema = {};
        schema.formula = new fields.StringField(),
        schema.characteristic = new fields.StringField({choices : foundry.utils.mergeObject({"" : ""}, game.oldworld.config.characteristics), blank: true, initial : ""})
        schema.ignoreArmour = new fields.BooleanField({})
        return schema;
    }
}