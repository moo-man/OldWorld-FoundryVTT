import { PhysicalItem } from "./components/physical";
import { TestModel } from "./components/test";

export class TrappingModel extends PhysicalItem 
{
    static defineSchema()
    {
        let schema = super.defineSchema();
        schema.test = new foundry.data.fields.EmbeddedDataField(TestModel);
        return schema;
    }


    async toEmbed(config, options)
    {
        let html = `
            <h3>@UUID[${this.parent.uuid}]{${config.label || this.parent.name}}</h3>
            ${this.description.public}
        `;
    
        let div = document.createElement("div");
        div.style = config.style;
        div.innerHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(html, {relativeTo : this, async: true, secrets : options.secrets})
        return div;
    }
}