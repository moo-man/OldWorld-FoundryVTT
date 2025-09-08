import { PhysicalItem } from "./components/physical";
let fields = foundry.data.fields;

export class AssetModel extends PhysicalItem 
{
    static LOCALIZATION_PREFIXES = ["WH.Models.asset"]
    static defineSchema()
    {
        let schema = super.defineSchema();
        schema.category = new fields.StringField({blank: true, choices : game.oldworld.config.assetCategory});
        return schema;
    }

    async toEmbed(config, options)
    {
        if (config.row)
        {

            let html = `
                <div style>
                    @UUID[${this.parent.uuid}]{${this.parent.name}}
                </div>
                <div>
                    ${this.cost ? game.oldworld.config.status[this.cost] : "n/a"}
                </div>
                <div>
                    ${this.description.public}
                </div>
            `;
        
            let div = document.createElement("div");
            div.style = config.style;
            div.style.display = "flex";
            div.classList.add("embed-row");
            div.innerHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(html, {relativeTo : this, async: true, secrets : options.secrets})
            return div;
        }
        else 
        {
            return "";
        }

    }


}