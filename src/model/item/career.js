import { BaseItemModel } from "./base";
let fields = foundry.data.fields;

export class CareerModel extends BaseItemModel 
{
    static LOCALIZATION_PREFIXES = ["WH.Models.career"]
    static defineSchema()
    {
        let schema = super.defineSchema();
        schema.characteristics  = new fields.SchemaField({
            ws : new fields.BooleanField(),
            bs : new fields.BooleanField(),
            s : new fields.BooleanField(),
            t : new fields.BooleanField(),
            i : new fields.BooleanField(),
            ag : new fields.BooleanField(),
            re : new fields.BooleanField(),
            fel : new fields.BooleanField()
        });

        schema.skills  = new fields.SchemaField({
            bonus : new fields.SchemaField({
                value : new fields.NumberField({initial : 1, min: 0}),
                chosen : new fields.StringField({})
            }),
            choices : {
                melee : new fields.BooleanField(),
                defence : new fields.BooleanField(),
                shooting : new fields.BooleanField(),
                maintenance : new fields.BooleanField(),
                brawn : new fields.BooleanField(),
                toil : new fields.BooleanField(),
                survival : new fields.BooleanField(),
                endurance : new fields.BooleanField(),
                awareness : new fields.BooleanField(),
                dexterity : new fields.BooleanField(),
                athletics : new fields.BooleanField(),
                stealth : new fields.BooleanField(),
                willpower : new fields.BooleanField(),
                recall : new fields.BooleanField(),
                leadership : new fields.BooleanField(),
                charm : new fields.BooleanField()
            }
        }),

        schema.status = new fields.StringField({choices : game.oldworld.config.status})

        schema.lore = new fields.EmbeddedDataField(ChoiceModel, {restrictType : ["lore"]})
        schema.trappings = new fields.EmbeddedDataField(ChoiceModel, {restrictType : ["trapping"]})
        schema.assets = new fields.EmbeddedDataField(ChoiceModel, {restrictType : ["asset"]})
        schema.contacts = new fields.EmbeddedDataField(DocumentReferenceListModel)

        schema.talent = new fields.EmbeddedDataField(DocumentReferenceModel);

        return schema;
    }
}