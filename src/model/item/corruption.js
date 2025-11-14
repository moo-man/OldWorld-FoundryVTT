import { BaseItemModel } from "./components/base";

let fields = foundry.data.fields;
export class CorruptionModel extends BaseItemModel {

    static LOCALIZATION_PREFIXES = ["WH.Models.corruption"]
    static defineSchema() {
        let schema = super.defineSchema();
        schema.level = new fields.NumberField({ min: 0, initial: 0, max: 3, choices : {0 : "TOW.Sheet.Vulnerable", 1 : "TOW.Sheet.Tarnished", 2: "TOW.Sheet.Tainted", 3: "TOW.Sheet.Damned"}});
        schema.vulnerable = new fields.HTMLField(),
        schema.tarnished = new fields.SchemaField({
            description: new fields.HTMLField(),
            effect: new fields.EmbeddedDataField(DocumentReferenceModel)
        })
        schema.tainted = new fields.SchemaField({
            description: new fields.HTMLField(),
            effect: new fields.EmbeddedDataField(DocumentReferenceModel)
        })
        schema.damned = new fields.SchemaField({
            description: new fields.HTMLField(),
            effect: new fields.EmbeddedDataField(DocumentReferenceModel)
        })
        return schema;
    }


    effectIsActive(effect) {

        // Since multiple blessing objects do exist on the actor according to faith level
        // only transfer the effects on the one registered in the singleton model
        if (effect.parent.id != this.parent.actor?.system.corruption.id) {
            return false;
        }
        if (this.tarnished.effect.id == effect.id) {
            return this.level >= 1;
        }
        if (this.tainted.effect.id == effect.id) {
            return this.level >= 2;
        }
        if (this.damned.effect.id == effect.id) {
            return this.level >= 3;
        }
        return true;

    }


    effectIsApplicable(effect) {
        return this.effectIsActive(effect);
    }

    shouldTransferEffect(effect) {
        return this.effectIsActive(effect);
    }

    async toEmbed(config, options)
    {
        let html = `<h3>@UUID[${this.parent.uuid}]{${this.parent.name}}</h3>
        ${this.description.public}
        <h4 data-no-toc="true">Vulnerable</h4>
        ${this.vulnerable}
        <h4 data-no-toc="true">Tarnished</h4>
        ${this.tarnished.description}
        <h4 data-no-toc="true">Tainted</h4>
        ${this.tainted.description}
        <h4 data-no-toc="true">Damned</h4>
        ${this.damned.description}
        `;
    
        let div = document.createElement("div");
        div.style = config.style;
        div.innerHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(`<div style="${config.style || ""}">${html}</div>`, {relativeTo : this, async: true, secrets : options.secrets})
        return div;
    }
}