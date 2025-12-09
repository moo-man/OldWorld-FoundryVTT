import { BaseItemModel } from "./components/base";
import { TestModel } from "./components/test";
let fields = foundry.data.fields;

export class TalentModel extends BaseItemModel 
{
    static LOCALIZATION_PREFIXES = ["WH.Models.talent"]
    static defineSchema()
    {
        let schema = super.defineSchema();
        schema.cost = new fields.NumberField({min: 0});
        schema.requirement = new fields.SchemaField({
            text : new fields.StringField({}),
            script : new fields.JavaScriptField({})
        })
        schema.test = new fields.EmbeddedDataField(TestModel);
        return schema;
    }

    
    async toEmbed(config, options)
    {
        let html = `
        <h4>@UUID[${this.parent.uuid}]{${this.parent.name}}</h4>
        <p><strong>Cost</strong>: ${this.cost} XP\t<strong>Requirements</strong>: ${this.requirement.text}</p>
        ${this.description.public}
        `;
    
        let div = document.createElement("div");
        div.style = config.style;
        div.innerHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(`<div style="${config.style || ""}">${html}</div>`, {relativeTo : this, async: true, secrets : options.secrets})
        return div;
    }
}