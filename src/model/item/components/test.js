let fields = foundry.data.fields;
export class TestModel extends foundry.abstract.DataModel
{
    static defineSchema() 
    {
        let schema = {};
        schema.skill = new fields.StringField();
        schema.dice = new fields.NumberField();
        schema.self = new fields.BooleanField();
        schema.opposed = new fields.BooleanField();
        return schema;
    }

    get label() 
    {

        if (this.skill)
        {
            return game.oldworld.config.skills[this.skill] + (this.dice ? ` (${(this.dice > 0 ? "+" : "")}${this.dice})` : "")  + " Test"
        }
        else 
        {
            return ""
        }
    }
}