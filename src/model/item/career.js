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
                maintenance: new fields.BooleanField(),
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
        schema.trappings = new fields.EmbeddedDataField(ChoiceModel, { restrictType: ["trapping"] })
        schema.assets = new fields.EmbeddedDataField(ChoiceModel, { restrictType: ["asset"] })
        schema.contacts = new fields.EmbeddedDataField(DocumentReferenceListModel)

        schema.origins = new fields.EmbeddedDataField(DocumentReferenceListModel);

        schema.talent = new fields.EmbeddedDataField(DocumentReferenceModel);

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

        await actor.createEmbeddedDocuments("Item", items);
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
}