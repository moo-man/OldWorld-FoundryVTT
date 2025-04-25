import { BaseItemModel } from "./base";

export class BlessingModel extends BaseItemModel 
{   
    
    static LOCALIZATION_PREFIXES = ["WH.Models.blessing"]
    static defineSchema()
    {
        let schema = super.defineSchema();
        schema.favour = new fields.HTMLField();
        schema.prayers = ListModel.createListModel(new fields.SchemaField({
            name : new fields.StringField(),
            description : new fields.HTMLField()
        }));
        schema.miracles = new fields.HTMLField();
        return schema;
    }

}