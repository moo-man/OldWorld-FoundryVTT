import { BaseItemModel } from "./components/base";

let fields = foundry.data.fields;

export class OriginModel extends BaseItemModel 
{
    static LOCALIZATION_PREFIXES = ["WH.Models.origin"]
    static defineSchema()
    {
        let schema = super.defineSchema();
        schema.characteristics  = new fields.SchemaField({
            ws : new fields.NumberField({min: 1}),
            bs : new fields.NumberField({min: 1}),
            s : new fields.NumberField({min: 1}),
            t : new fields.NumberField({min: 1}),
            i : new fields.NumberField({min: 1}),
            ag : new fields.NumberField({min: 1}),
            re : new fields.NumberField({min: 1}),
            fel : new fields.NumberField({min: 1})
        });

        schema.maxCharacteristics  = new fields.SchemaField({
            ws : new fields.NumberField({min: 1, initial: 6}),
            bs : new fields.NumberField({min: 1, initial: 6}),
            s : new fields.NumberField({min: 1, initial: 6}),
            t : new fields.NumberField({min: 1, initial: 6}),
            i : new fields.NumberField({min: 1, initial: 6}),
            ag : new fields.NumberField({min: 1, initial: 6}),
            re : new fields.NumberField({min: 1, initial: 6}),
            fel : new fields.NumberField({min: 1, initial: 6})
        });


        schema.skills = ListModel.createListModel(new fields.SchemaField({
            value : new fields.NumberField({initial: 3}),
            skill : new fields.StringField({}), // blank for default, * for choice
            group : new fields.NumberField({})
        }))

        schema.talents = new fields.SchemaField({
            table : new fields.EmbeddedDataField(DocumentReferenceModel),
            rolls: new fields.NumberField({initial : 2}),
            keep: new fields.NumberField({initial : 0}),
            gain: new fields.EmbeddedDataField(DocumentReferenceListModel),
            replacements: new fields.EmbeddedDataField(DocumentReferenceListModel)
        })

        schema.lores = ListModel.createListModel(new fields.SchemaField({
            name : new fields.StringField({}),
            choices : new fields.NumberField({}),
            group : new fields.NumberField({nullable : true, required: false, blank: true})
        }))
        schema.careers = new fields.EmbeddedDataField(DocumentReferenceModel),
        schema.fate = new fields.NumberField({min : 0});
        return schema;
    }
}