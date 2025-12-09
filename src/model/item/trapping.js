import { EquippableItem } from "./components/equippable";
import { TestModel } from "./components/test";
let fields = foundry.data.fields;

export class TrappingModel extends EquippableItem 
{
    static LOCALIZATION_PREFIXES = ["WH.Models.trapping"]
    static defineSchema()
    {
        let schema = super.defineSchema();
        schema.test = new fields.EmbeddedDataField(TestModel);
        schema.equippable = new fields.BooleanField()
        return schema;
    }

    get isEquipped()
    {
        return (!this.isEquippable || this.equipped.value)
    }
    
    get isEquippable() 
    {
        return this.equippable;
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