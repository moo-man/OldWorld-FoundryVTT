let fields = foundry.data.fields;
export class DamageModel extends foundry.abstract.DataModel 
{
    static defineSchema() 
    {
        let schema = {};
        schema.formula = new fields.StringField(),
        schema.characteristic = new fields.StringField({choices : foundry.utils.mergeObject({"" : ""}, game.oldworld.config.characteristics), blank: true, initial : ""})
        schema.ignoreArmour = new fields.BooleanField({})
        schema.bonus = new fields.NumberField({})
        return schema;
    }

    compute(actor)
    {
        this.value = Roll.safeEval(Roll.replaceFormulaData(this.formula, actor.getRollData()));
        if (this.characteristic)
        {
            this.value += actor.system.characteristics[this.characteristic].value;
        }
        this.value += this.bonus || 0;
    }
}