import { DamageModel } from "./components/damage";
import { EquippableItem } from "./components/equippable";
import { PhysicalItem } from "./components/physical";
import { TestModel } from "./components/test";
let fields = foundry.data.fields;

export class WeaponModel extends EquippableItem 
{
    static LOCALIZATION_PREFIXES = ["WH.Models.weapon"]
    static defineSchema()
    {
        let schema = super.defineSchema();
        schema.skill = new fields.StringField({choices : {melee : "TOW.Melee", brawn : "TOW.Brawn", shooting : "TOW.Shooting", throwing : "TOW.Throwing"}, initial : "melee"})
        schema.range = new fields.SchemaField({
            min : new fields.NumberField({choices : game.oldworld.config.range, initial : 0}),
            max : new fields.NumberField({choices : game.oldworld.config.range, initial : 0}),
            melee : new fields.NumberField({choices : game.oldworld.config.range, initial : 0}),
        })
        schema.test = new fields.EmbeddedDataField(TestModel);
        schema.damage = new fields.EmbeddedDataField(DamageModel);
        schema.grip = new fields.StringField({choices : {"1H" : "1H", "2H" : "2H"}, initial : "1H"}),
        schema.traits = new fields.StringField({});
        return schema;
    }

    get isMelee()
    {
        return ["melee", "brawn"].includes(this.skill);
    }

    get isRanged()
    {
        return ["shooting", "throwing"].includes(this.skill);
    }

    computeOwned(actor) 
    {
        this.damage.compute(actor);
    }
}