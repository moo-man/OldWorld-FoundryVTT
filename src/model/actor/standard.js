import { BaseActorModel } from "./base";
import { CharacteristicsModel } from "./components/characteristics";
import { SkillsModel } from "./components/skills";
let fields = foundry.data.fields;

/**
 * Represents actors that have characteristics and skills
 * Encompasses player characters and NPCs
 */
export class StandardActorModel extends BaseActorModel 
{
    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.characteristics = new fields.EmbeddedDataField(CharacteristicsModel);
        schema.skills = new fields.EmbeddedDataField(SkillsModel);
        schema.speed = new fields.SchemaField({
            land : new  fields.StringField({initial : "normal"}),
            fly : new  fields.StringField({initial : "none"})
        })
        return schema;
    }

    async _preUpdate(data, options, user)
    {
        await super._preUpdate(data, options, user);

    }

    async _onUpdate(data, options, user)
    {
        await super._onUpdate(data, options, user);
    }
    
    computeBase() 
    {
        super.computeBase();
        this.characteristics.compute();
        this.skills.compute();
        this.resilience = 0;
    }
    computeDerived()
    {
        super.computeDerived();
        try {
            this.parent.itemTypes.armour.filter(i => i.system.isEquipped).forEach(i => this.resilience +=  (Roll.safeEval(Roll.replaceFormulaData(i.system.resilience, this.parent)) || 0))
        }
        catch(e)
        {
            console.error(`(${this.parent.name}) Error when computing resilience: ` + e)
        }
    }
}

