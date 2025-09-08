import { EquippableItem } from "./components/equippable";
let fields = foundry.data.fields;

export class ArmourModel extends EquippableItem 
{
    static LOCALIZATION_PREFIXES = ["WH.Models.armour"]
    static defineSchema()
    {
        let schema = super.defineSchema();
        schema.resilience = new fields.StringField({});
        schema.traits = new fields.StringField({});
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
                    T${this.resilience ? "+" + this.resilience : ""}
                </div>
                <div>
                    ${this.traits}
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