import { BaseItemModel } from "./components/base";
import { DamageModel } from "./components/damage";
import { ModifiersModel } from "./components/modifier";
import { TestModel } from "./components/test";
let fields = foundry.data.fields;

export class AbilityModel extends BaseItemModel 
{
    static LOCALIZATION_PREFIXES = ["WH.Models.ability"]
    static defineSchema()
    {
        let schema = super.defineSchema();
        schema.test = new fields.EmbeddedDataField(TestModel);
        schema.damage = new fields.EmbeddedDataField(DamageModel);
        schema.attack = new fields.SchemaField({
            skill : new fields.StringField({choices : {melee : "TOW.Melee", brawn : "TOW.Brawn", shooting : "TOW.Shooting", throwing : "TOW.Throwing"}, initial : "", blank: true}),
            range : new fields.SchemaField({
                min : new fields.NumberField({choices : game.oldworld.config.range, initial : 0}),
                max : new fields.NumberField({choices : game.oldworld.config.range, initial : 0}),
                melee : new fields.NumberField({choices : game.oldworld.config.range, initial : 0}),
            }),
            grip : new fields.StringField({choices : {"1H" : "1H", "2H" : "2H"}, initial: "", blank: true}),
            modifiers : new fields.EmbeddedDataField(ModifiersModel),
            traits : new fields.StringField({})
        })
        return schema;
    }

    get isAttack()
    {
        return !!this.attack.skill;
    }
    
    get isMelee()
    {
        return ["melee", "brawn"].includes(this.attack.skill);
    }

    get isRanged()
    {
        return ["shooting", "throwing"].includes(this.attack.skill);
    }

    get isMagical()
    {
        return this.damage.magical;
    }


    computeOwned(actor) 
    {
        this.damage.compute(actor);
    }

    getOtherEffects()
    {
        let scripts = this.attack.modifiers.createScripts();

        if (scripts.length && this.isAttack)
        {
            return [new ActiveEffect.implementation({
                name : this.parent.name,
                img : this.parent.img,
                system : {
                    scriptData : scripts
                }
            }, {parent : this.parent})]
        }
        else return [];

    }
}