import { BaseItemModel } from "./components/base";

let fields = foundry.data.fields;

export class CareerModel extends BaseItemModel {
    static LOCALIZATION_PREFIXES = ["WH.Models.career"]
    static defineSchema() {
        let schema = super.defineSchema();
        schema.characteristics = new fields.SchemaField({
            ws: new fields.BooleanField(),
            bs: new fields.BooleanField(),
            s: new fields.BooleanField(),
            t: new fields.BooleanField(),
            i: new fields.BooleanField(),
            ag: new fields.BooleanField(),
            re: new fields.BooleanField(),
            fel: new fields.BooleanField()
        });

        schema.skills = new fields.SchemaField({
            bonus: new fields.SchemaField({
                value: new fields.NumberField({ initial: 4, min: 0 }),
                chosen: new fields.StringField({})
            }),
            choices: new fields.SchemaField({
                melee: new fields.BooleanField(),
                defence: new fields.BooleanField(),
                shooting: new fields.BooleanField(),
                throwing: new fields.BooleanField(),
                brawn: new fields.BooleanField(),
                toil: new fields.BooleanField(),
                survival: new fields.BooleanField(),
                endurance: new fields.BooleanField(),
                awareness: new fields.BooleanField(),
                dexterity: new fields.BooleanField(),
                athletics: new fields.BooleanField(),
                stealth: new fields.BooleanField(),
                willpower: new fields.BooleanField(),
                recall: new fields.BooleanField(),
                leadership: new fields.BooleanField(),
                charm: new fields.BooleanField()
            })
        }),

        schema.status = new fields.StringField({ choices: game.oldworld.config.status })

        schema.lore = new fields.EmbeddedDataField(ChoiceModel, { restrictType: ["lore"] })
        schema.trappings = new fields.EmbeddedDataField(ChoiceModel, { restrictType: ["trapping", "weapon", "armour", "toolKit"] })
        schema.assets = new fields.EmbeddedDataField(ChoiceModel, { restrictType: ["asset"] })
        schema.contacts = new fields.EmbeddedDataField(DeferredReferenceListModel)

        schema.origins = new fields.EmbeddedDataField(DeferredReferenceListModel);

        schema.talent = new fields.EmbeddedDataField(DeferredReferenceModel);

        return schema;
    }

    async _preCreate(data, options, user) {
        await super._preCreate(data, options, user);

        if (this.parent.isOwned && (await foundry.applications.api.Dialog.confirm({ window: { title: this.parent.name }, content: game.i18n.localize("TOW.Dialog.ApplyCareer") }))) {
            this.applyTo(this.parent.actor)
        }
    }

    async applyTo(actor) {
        let skills = Object.keys(this.skills.choices).filter(s => this.skills.choices[s])

        let skillChoices = await ItemDialog.create(skills.map(s => {
            return {
                id: s,
                name: game.oldworld.config.skills[s]
            }
        }), this.skills.bonus.value,
            {
                title: game.i18n.localize("TOW.Dialog.ChooseSkills"),
                text: game.i18n.format("TOW.Dialog.ChooseSkillsContent", { number: this.skills.bonus.value }
                )
            })

        let lores = await this.lore.promptDecision();
        let trappings = await this.trappings.promptDecision();
        let assets = await this.assets.promptDecision();
        // let contacts = await this.contacts.promptDecision();

        let talent = await this.talent.document;

        let items = lores.concat(trappings).concat(assets).concat(talent);
        if (!actor.system.origin.document) {

        }

        await actor.createEmbeddedDocuments("Item", items.filter(i => i));
        let actorSkills = actor.system.skills.toObject();
        for (let s of skillChoices) {
            actorSkills[s.id].base++;
        }
        await actor.update({ "system.skills": actorSkills });
    }

    computeBase() {
        if (this.parent.actor) 
        {
            for (let char of Object.keys(this.characteristics)) 
            {
                if (this.characteristics[char]) 
                {
                    this.parent.actor.system.characteristics[char].favoured = true;
                }
            }
        }
    }

    async toEmbed(config, options)
    {
        let originString = this.origins.list.length ? this.origins.list.map(i => i.name).join(", ") : "All";
        let charString = Object.keys(this.characteristics).filter(i => this.characteristics[i]).map(i => game.oldworld.config.characteristics[i]).join(", ")

        let skills = Object.keys(this.skills.choices).filter(i => this.skills.choices[i]).map(i => game.oldworld.config.skills[i]).join(", ")
        let skillString = `+1 to ${this.skills.bonus.value} of the following: ${skills}`;

        let careerTalent = await this.talent.document;

        let html = `
        <div class="header">
            <label class="title"><a data-link data-uuid="${this.parent.uuid}">${this.parent.name}</a></label>
            <span class="status">~ ${game.oldworld.config.status[this.status]} ~</span>
        </div>

        <div class="table">
            <div class="property-header stacked blue" style="grid-column: 1 / span 3">Origins</div>
            <div class="property-header stacked blue" style="grid-column: 4 / span 3">Favoured Characteristics</div>
            <div class="property-value stacked" style="grid-column: 1 / span 3">${originString}</div>
            <div class="property-value stacked" style="grid-column: 4 / span 3">${charString}</div>
            <div class="property-header" style="grid-column: 1 / span 1">Skill Bonuses</div>
            <div class="property-value" style="grid-column: 2 / span 5">${skillString}</div>
            <div class="property-header blue" style="grid-column: 1 / span 1">Lore</div>
            <div class="property-value" style="grid-column: 2 / span 2"><p>${this.lore.textDisplay.replaceAll("OR", "<em>or</em>")}</p></div>
            <div class="property-header blue" style="grid-column: 4 / span 1">Trappings</div>
            <div class="property-value" style="grid-column: 5 / span 2"><p>${this.trappings.textDisplay.replaceAll("OR", "<em>or</em>")}</p></div>
            <div class="property-header" style="grid-column: 1 / span 1">Assets</div>
            <div class="property-value" style="grid-column: 2 / span 2"><p>${this.assets.textDisplay.replaceAll("OR", "<em>or</em>")}</p></div>
            <div class="property-header" style="grid-column: 4 / span 1">Contacts</div>
            <div class="property-value" style="grid-column: 5 / span 2">${this.contacts.list.map(i => i.name).join(", ")}</div>
            <div class="property-header blue" style="grid-column: 1 / span 1">Career Talents</div>
            <div class="property-value" style="grid-column: 2 / span 5"><p>@UUID[${careerTalent.uuid}]{${careerTalent.name}}: ${careerTalent.system.description.public.replace("<p>", "")}</div>
        </div>

        `

        let div = document.createElement("div");
        div.style = config.style;
        div.innerHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(`<div style="${config.style || ""}">${html}</div>`, {relativeTo : this, async: true, secrets : options.secrets})
        return div;
    }
}