import { BaseItemModel } from "./components/base";
let fields = foundry.data.fields;

export class LoreModel extends BaseItemModel 
{
    static LOCALIZATION_PREFIXES = ["WH.Models.lore"]
    static defineSchema()
    {
        let schema = super.defineSchema();
        schema.category  = new fields.StringField();
        return schema;
    }


    static async findCategories(category)
    {
        let lores = (await warhammer.utility.findAllItems("lore", undefined, true, ["system.category"])).filter(i => i.system.category == category);
        
        let items = await Promise.all(lores.map(i => foundry.utils.fromUuid(i.uuid)));

        return items;
    }

}