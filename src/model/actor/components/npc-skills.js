let fields = foundry.data.fields;

export class NPCSkillsModel extends foundry.abstract.DataModel 
{
    static defineSchema() 
    {
        let schema = {};
        schema.melee = new fields.SchemaField({
            base: new fields.NumberField({initial : 3}),
            modifier: new fields.NumberField({initial : 0}),
            characteristic : new fields.StringField({initial : "ws"})
        });
        schema.defence = new fields.SchemaField({
            base: new fields.NumberField({initial : 3}),
            modifier: new fields.NumberField({initial : 0}),
            characteristic : new fields.StringField({initial : "ws"})
        });

        schema.shooting = new fields.SchemaField({
            base: new fields.NumberField({initial : 3}),
            modifier: new fields.NumberField({initial : 0}),
            characteristic : new fields.StringField({initial : "bs"})
        });
        schema.maintenance = new fields.SchemaField({
            base: new fields.NumberField({initial : 3}),
            modifier: new fields.NumberField({initial : 0}),
            characteristic : new fields.StringField({initial : "bs"})
        });

        schema.brawn = new fields.SchemaField({
            base: new fields.NumberField({initial : 3}),
            modifier: new fields.NumberField({initial : 0}),
            characteristic : new fields.StringField({initial : "s"})
        });
        schema.toil = new fields.SchemaField({
            base: new fields.NumberField({initial : 3}),
            modifier: new fields.NumberField({initial : 0}),
            characteristic : new fields.StringField({initial : "s"})
        });

        schema.survival = new fields.SchemaField({
            base: new fields.NumberField({initial : 3}),
            modifier: new fields.NumberField({initial : 0}),
            characteristic : new fields.StringField({initial : "t"})
        });
        schema.endurance = new fields.SchemaField({
            base: new fields.NumberField({initial : 3}),
            modifier: new fields.NumberField({initial : 0}),
            characteristic : new fields.StringField({initial : "t"})
        });

        schema.awareness = new fields.SchemaField({
            base: new fields.NumberField({initial : 3}),
            modifier: new fields.NumberField({initial : 0}),
            characteristic : new fields.StringField({initial : "i"})
        });
        schema.dexterity = new fields.SchemaField({
            base: new fields.NumberField({initial : 3}),
            modifier: new fields.NumberField({initial : 0}),
            characteristic : new fields.StringField({initial : "i"})
        });

        schema.athletics = new fields.SchemaField({
            base: new fields.NumberField({initial : 3}),
            modifier: new fields.NumberField({initial : 0}),
            characteristic : new fields.StringField({initial : "ag"})
        });
        schema.stealth = new fields.SchemaField({
            base: new fields.NumberField({initial : 3}),
            modifier: new fields.NumberField({initial : 0}),
            characteristic : new fields.StringField({initial : "ag"})
        });

        schema.willpower = new fields.SchemaField({
            base: new fields.NumberField({initial : 3}),
            modifier: new fields.NumberField({initial : 0}),
            characteristic : new fields.StringField({initial : "re"})
        });
        schema.recall = new fields.SchemaField({
            base: new fields.NumberField({initial : 3}),
            modifier: new fields.NumberField({initial : 0}),
            characteristic : new fields.StringField({initial : "re"})
        });

        schema.leadership = new fields.SchemaField({
            base: new fields.NumberField({initial : 3}),
            modifier: new fields.NumberField({initial : 0}),
            characteristic : new fields.StringField({initial : "fel"})
        });
        schema.charm = new fields.SchemaField({
            base: new fields.NumberField({initial : 3}),
            modifier: new fields.NumberField({initial : 0}),
            characteristic : new fields.StringField({initial : "fel"})
        });

        return schema;
    }


    compute() 
    {
        for(let skill of Object.values(this))
        {
            skill.value = skill.base + skill.modifier;
        }
    }
}