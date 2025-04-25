import { PhysicalItem } from "./components/physical";

export class AssetModel extends PhysicalItem 
{
    static LOCALIZATION_PREFIXES = ["WH.Models.asset"]
    static defineSchema()
    {
        let schema = super.defineSchema();
        schema.category = new fields.StringField({blank: true, choices : game.oldworld.config.assetCategory});
        return schema;
    }

}