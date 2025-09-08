import { PhysicalItem } from "./components/physical";
import { TestModel } from "./components/test";
let fields = foundry.data.fields;

export class ToolKitModel extends PhysicalItem 
{
    static LOCALIZATION_PREFIXES = ["WH.Models.toolKit"]
    static defineSchema()
    {
        let schema = super.defineSchema();
        schema.tests = new fields.StringField({});
        schema.lore = new fields.StringField({});
        schema.test = new fields.EmbeddedDataField(TestModel);
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
                <div>
                    ${this.tests}
                </div>
                <div>
                    ${this.lore}
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