import { BaseItemModel } from "./components/base";
import { LoreModel } from "./lore";

let fields = foundry.data.fields;

export class OriginModel extends BaseItemModel {
    static LOCALIZATION_PREFIXES = ["WH.Models.origin"]
    static defineSchema() {
        let schema = super.defineSchema();
        schema.characteristics = new fields.SchemaField({
            ws: new fields.NumberField({ min: 1 }),
            bs: new fields.NumberField({ min: 1 }),
            s: new fields.NumberField({ min: 1 }),
            t: new fields.NumberField({ min: 1 }),
            i: new fields.NumberField({ min: 1 }),
            ag: new fields.NumberField({ min: 1 }),
            re: new fields.NumberField({ min: 1 }),
            fel: new fields.NumberField({ min: 1 })
        });

        schema.maxCharacteristics = new fields.SchemaField({
            ws: new fields.NumberField({ min: 1, initial: 6 }),
            bs: new fields.NumberField({ min: 1, initial: 6 }),
            s: new fields.NumberField({ min: 1, initial: 6 }),
            t: new fields.NumberField({ min: 1, initial: 6 }),
            i: new fields.NumberField({ min: 1, initial: 6 }),
            ag: new fields.NumberField({ min: 1, initial: 6 }),
            re: new fields.NumberField({ min: 1, initial: 6 }),
            fel: new fields.NumberField({ min: 1, initial: 6 })
        });


        schema.skills = ListModel.createListModel(new fields.SchemaField({
            value: new fields.NumberField({ initial: 3 }),
            skill: new fields.StringField({}), // blank for default, * for choice
            group: new fields.NumberField({})
        }))

        schema.talents = new fields.SchemaField({
            table: new fields.EmbeddedDataField(DocumentReferenceModel),
            rolls: new fields.NumberField({ initial: 2 }),
            gain: new fields.EmbeddedDataField(DocumentReferenceListModel),
            replacements: new fields.EmbeddedDataField(DocumentReferenceListModel),
            optional: new fields.EmbeddedDataField(DocumentReferenceListModel)
        })

        schema.lores = ListModel.createListModel(new fields.SchemaField({
            name: new fields.StringField({}),
            category: new fields.StringField({}),
            group: new fields.NumberField({ nullable: true, required: false, blank: true })
        }))
        schema.careers = new fields.EmbeddedDataField(DocumentReferenceModel),
        schema.fate = new fields.NumberField({ min: 0 });
        return schema;
    }


    async _preCreate(data, options, user) {
        await super._preCreate(data, options, user);

        if (this.parent.isOwned && (await foundry.applications.api.Dialog.confirm({ window: { title: this.parent.name }, content: game.i18n.localize("TOW.Dialog.ApplyOrigin") }))) {
            this.applyTo(this.parent.actor)
        }
    }

    async applyTo(actor) {

        if (actor.type != "character")
        {
            return;
        }

        let characteristics = actor.system.characteristics.toObject()
        for (let characteristic in actor.system.characteristics) {
            characteristics[characteristic].base = this.characteristics[characteristic]
        }

        let defaultSkill = this.skills.list.find(i => !i.skill)?.value || 2

        // **** SKILLS ****

        let skillBonuses = [];
        let skillGroups = {};

        // Go through each skill and if they have a group specified, store it for choosing later
        for (let skill of this.skills.list) {
            // Put each skill that specifies the same group into an array
            if (skill.group) {
                skillGroups[skill.group] ? skillGroups[skill.group].push(skill) : skillGroups[skill.group] = [skill]
            }
            else // No group, just add to bonuses
            {
                skillBonuses.push(skill);
            }
        }

        for (let g in skillGroups) {
            // If skill is the only one in the group, just push it
            if (skillGroups[g].length == 1) {
                skillBonuses.push(groups[g][0])
            }
            else if (skillGroups[g].length >= 2) // Decide between 2 or more skills
            {
                let choices = await ItemDialog.create(skillGroups[g].map(skill => {
                    skill.id = skill.skill;
                    skill.name = game.oldworld.config.skills[skill.skill] + ` (${skill.value})`
                    return skill
                }), 1, { title: this.parent.name, text: `Select Initial Skills` });

                skillBonuses = skillBonuses.concat(choices || []);
            }
        }
        // **** LORES ****
        let lores = [];
        let loreGroups = {};

        // Go through each skill and if they have a group specified, store it for choosing later
        for (let lore of this.lores.list) {
            // Put each skill that specifies the same group into an array
            if (lore.group) {
                loreGroups[lore.group] ? loreGroups[lore.group].push(lore) : loreGroups[lore.group] = [lore]
            }
            else // No group, just add to bonuses
            {
                lores.push(lore);
            }
        }

        for (let g in loreGroups) {
            // If skill is the only one in the group, just push it
            if (loreGroups[g].length == 1) {
                lores.push(groups[g][0])
            }
            else if (loreGroups[g].length >= 2) // Decide between 2 or more skills
            {
                let choices = await ItemDialog.create(loreGroups[g].map((lore, index) => {
                    lore.id = index;
                    if (!lore.name && lore.category) {
                        lore.name = "Any " + lore.category + " Lore"
                    }
                    else if (lore.name) {
                        delete lore.category; // If category is defined, it will search for lores with that category. 
                    }
                    return lore
                }), 1, { title: this.parent.name, text: `Select Lores` });

                lores = lores.concat(choices || []);
            }
        }


        for (let lore of lores) {
            if (lore.category) {
                let categoryLores = await LoreModel.findCategories(lore.category);
                let choices = await ItemDialog.create(categoryLores, 1, { title: this.parent.name, text: `Select ${lore.category} Lore, or select none to enter in manually` });

                if (choices.length == 0) {
                    choices = [{ name: await ValueDialog.create({ title: this.parent.name, text: `Enter ${lore.category} Lore` }) }];
                }

                lore.name = choices[0].name;
            }

            lore.type = "lore";
            lore.system = {
                category: lore.category
            }
        }


        // All Talents gained automatically
        let talents = (await Promise.all(this.talents.gain.documents)).map(i => i.toObject());

        // The Talents that will be swapped for some rolled talents
        let requiredTalents = await Promise.all(this.talents.replacements.documents);

        // The Talents that may be swapped for some rolled talents
        let optionalTalents = await Promise.all(this.talents.optional.documents);

        // All rolled table talents
        let tableTalents = [];

        let table = await this.talents.table.document;
        if (table) {
            let _abortCounter = 0;
            for (let i = 0; i < this.talents.rolls; i++) {
                let result = await table.roll();
                let talentItem = await fromUuid(result.results[0].documentUuid);
                if (tableTalents.find(i => i.name == talentItem.name)) {
                    i--; // Reroll talent
                    _abortCounter++;
                    if (_abortCounter > 10) {
                        throw new Error("Talent Table resulted in too many rerolls, aborting")
                    }
                }
                else {
                    tableTalents.push(talentItem)
                }
            }
        }
        else {
            ui.notifications.error("No Table found for Talents")
        }


        let requiredSwaps = []
        if (requiredTalents.length) {
            for(let talent of requiredTalents)
            {
                let swap = await ItemDialog.create(tableTalents, 1, { title: this.parent.name, text: `You must replace a Talent for ${talent.name}.`})
                if (swap[0])
                {
                    // Add to swapped array if choice is made 
                    requiredSwaps.push(talent);
                    tableTalents = tableTalents.filter(i => i.name != swap[0].name); // Remove talent swapped
                }
            }
        }
        
        // Array of talents swapped for (not the rolled talents that were swapped)
        let optionalSwaps = []
        if (optionalTalents.length) {
            for(let talent of optionalTalents)
            {
                let swap = await ItemDialog.create(tableTalents, 1, { title: this.parent.name, text: `Optionally replace a Talent for ${talent.name}, or close to skip.`})
                if (swap[0])
                {
                    // Add to swapped array if choice is made 
                    optionalSwaps.push(talent);
                    tableTalents = tableTalents.filter(i => i.name != swap[0].name); // Remove talent swapped
                }
            }
        }

        // Combine rolled and kept talents with replacement talents and automatically gained talents
        talents = talents.concat(requiredSwaps.concat(optionalSwaps.concat(tableTalents)).map(i =>  i.toObject()));

        await actor.createEmbeddedDocuments("Item", talents.concat(lores));

        let actorSkills = actor.system.skills.toObject();
        for (let s of Object.values(actorSkills)) {
            s.base = defaultSkill
        }

        for (let bonus of skillBonuses) {
            let skill = bonus.skill
            if (!skill) {
                continue;
            }
            if (skill == "*") {
                let choice = await ItemDialog.create(ItemDialog.objectToArray(game.oldworld.config.skills), 1, { title: this.parent.name, text: "Select Skill to raise to " + bonus.value });
                skill = [choice[0].id]
            }
            actorSkills[skill].base = bonus.value;
        }

        await actor.update({ "system.characteristics": characteristics, "system.skills": actorSkills, "system.fate.max": this.fate });
    }

    async toEmbed(config, options)
    {
        let  table  =   await  this.talents.table.document;

        let tableHTML = `
        <table>
            <tr>
                <th>d10</th>
                <th>Random Talent</th>
                <th>d10</th>
                <th>Random Talent</th>
            </tr>
            <tr>
                <td>1</td>
                <td>1:result</td>
                <td>6</td>
                <td>6:result</td>
            </tr>
            <tr>
                <td>2</td>
                <td>2:result</td>
                <td>7</td>
                <td>7:result</td>
            </tr>
            <tr>
                <td>3</td>
                <td>3:result</td>
                <td>8</td>
                <td>8:result</td>
            </tr>
            <tr>
                <td>4</td>
                <td>4:result</td>
                <td>9</td>
                <td>9:result</td>
            </tr>
            <tr>
                <td>5</td>
                <td>5:result</td>
                <td>10</td>
                <td>10:result</td>
            </tr>
        </table>
        `

        let tableInstructions = `Roll ${this.talents.rolls} ${this.talents.rolls == 1 ? "time" : "times, rerolling duplicates"}.`

        if (this.talents.replacements.list.length)
        {
            tableInstructions += `You must swap ${this.talents.replacements.list.length} of these Talents for ${this.talents.replacements.list.map(i => `@UUID[${i.uuid}]{${i.name}}`).join(" and ")}.`
        }

        if (this.talents.optional.list.length)
        {
            tableInstructions += `You may swap ${this.talents.optional.list.length} of these Talents for ${this.talents.optional.list.map(i => `@UUID[${i.uuid}]{${i.name}}`).join(" and ")}.`
        }

        if (this.talents.gain.list.length)
        {
            tableInstructions += `You also gain ${this.talents.gain.list.map(i => `@UUID[${i.uuid}]{${i.name}}`).join(" and ")}.`
        }

        for(let result of table.results.contents)
        {
            tableHTML = tableHTML.replace(`${result.range[0]}:result`, `@UUID[${result.documentUuid}]{${result.name}}`)
        }


        let start = this.skills.list.find(i => !i.skill)?.value || 2;
        let choices = this.skills.list.filter(i => i.skill == "*");
        let skills = this.skills.list.filter(i => i.skill && i.skill != "*");

        let skillText = `Your skills begin at ${start}. `
        if (choices.length)
        {
            if (skills.length)
            {
                skillText += `Raise ${skills.map(c => game.oldworld.config.skills[c.skill]).join(", ")} and ${choices.length} other skills of your choice to ${skills[0].value}`
            }
            else 
            {
                skillText += `Raise any ${choices.length} skills of your choice to ${choices[0].value}`
            }
        }
        else 
        {
            skillText += `Raise ${skills.map(c => game.oldworld.config.skills[c.skill]).join(", ")} to ${skills[0].value}`
        }


        let loreText = `${this.lores.list.filter(i => !i.group).map(i => i.name)}. `;
        let groups = []
        this.lores.list.forEach(i => {
            if (i.group)
            {
                if (!groups.includes(i.group))
                {
                    groups.push(i.group);
                }
            }
        })

        for(let group of groups)
        {
            loreText += `${this.lores.list.filter(i => i.group == group).map(i => i.name).join(" or ")}.`
        }


        let html = `
        <div class="header">
            <label class="title"><a data-link data-uuid="${this.parent.uuid}">${config.label || this.parent.name}</a></label>
        </div>
        <div class="origin-data">
            <div  class="table">
                ${tableHTML}
                <p class="instructions">${tableInstructions}</p>
            </div>
            <div class="details">
                <p><strong>Skill Ratings:</strong> ${skillText}</p>
                <p><strong>Lores:</strong> ${loreText}</p>
                <p><strong>Fate:</strong> ${this.fate}</p>
                ${config.text || ""}
            </div>
        </div>`

        let div = document.createElement("div");
        div.style = config.style;
        div.innerHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(`<div style="${config.style || ""}">${html}</div>`, {relativeTo : this, async: true, secrets : options.secrets})
        return div;
    }
}