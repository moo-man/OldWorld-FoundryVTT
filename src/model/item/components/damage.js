let fields = foundry.data.fields;
export class DamageModel extends foundry.abstract.DataModel 
{
    static defineSchema() 
    {
        let schema = {};
        schema.formula = new fields.StringField(),
        schema.characteristic = new fields.StringField({choices : foundry.utils.mergeObject({"" : ""}, game.oldworld.config.characteristics), blank: true, initial : ""})
        schema.ignoreArmour = new fields.BooleanField()
        schema.magical = new fields.BooleanField()
        schema.successes = new fields.BooleanField({initial : true});
        schema.bonus = new fields.NumberField({})
        schema.excludeStaggeredOptions = new fields.SchemaField({
            give : new fields.BooleanField(),
            prone : new fields.BooleanField(),
            wounds : new fields.BooleanField()
        })
        return schema;
    }

    compute(actor)
    {
        this.value = this.formula ? (Roll.safeEval(Roll.replaceFormulaData(this.formula, actor.getRollData()))) : 0;
        if (this.characteristic && actor.system.characteristics)
        {
            this.value += actor.system.characteristics[this.characteristic].value;
        }
        this.value += this.bonus || 0;
    }

    get excludedOptions()
    {
        return Object.keys(this.excludeStaggeredOptions).filter(i => this.excludeStaggeredOptions[i]);
    }
}