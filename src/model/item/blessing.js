import { BaseItemModel } from "./components/base";

let fields = foundry.data.fields;
export class BlessingModel extends BaseItemModel {

    static LOCALIZATION_PREFIXES = ["WH.Models.blessing"]
    static defineSchema() {
        let schema = super.defineSchema();
        schema.level = new fields.NumberField({ min: 1, initial: 1, max: 3 });
        schema.favour = new fields.SchemaField({
            description: new fields.HTMLField(),
            effect: new fields.EmbeddedDataField(DocumentReferenceModel)
            // effects : new fields.EmbeddedDataField(DocumentReferenceListModel)
        })
        schema.prayers = ListModel.createListModel(new fields.SchemaField({
            name: new fields.StringField(),
            description: new fields.HTMLField(),
            effect: new fields.EmbeddedDataField(DocumentReferenceModel)
            // effects : new fields.EmbeddedDataField(DocumentReferenceListModel)
        }));
        schema.miracles = new fields.SchemaField({
            description: new fields.HTMLField(),
            used: new fields.BooleanField()
        })
        return schema;
    }

    _addModelProperties() {
        this.favour.effect.relative = this.parent.effects;
        for(let prayer of this.prayers.list)
        {
            prayer.effect.relative = this.parent.effects;
        }
    }

    effectIsActive(effect) {

        // Since multiple blessing objects do exist on the actor according to faith level
        // only transfer the effects on the one registered in the singleton model
        if (effect.parent.id != this.parent.actor?.system.blessed.id) {
            return false;
        }
        if (this.favour.effect.id == effect.id) {
            return this.level >= 1;
        }

        for(let p of this.prayers.list)
        {
            if (p.effect.id == effect.id) 
            {
                return this.level >= 2
            }
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
        let html = `<h4>@UUID[${this.parent.uuid}]{${config.label || this.parent.name + 's Favour'}}</h4>
        <p>${this.favour.description}</p>
        <h4>Prayers of ${this.parent.name}</h4>
        ${this.prayers.list.map(i => {
            return `<h5>${i.name}</h5><p>${i.description}</p>`
        }).join("")}
        <h4>Miracles of ${this.parent.name}</h4><p>${this.miracles.description}</p>
        `;
    
        let div = document.createElement("div");
        div.style = config.style;
        div.innerHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(`<div style="${config.style || ""}">${html}</div>`, {relativeTo : this, async: true, secrets : options.secrets})
        return div;
    }
}