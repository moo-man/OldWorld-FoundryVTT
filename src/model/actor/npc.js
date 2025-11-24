import { StandardActorModel } from "./standard";
let fields = foundry.data.fields;

export class NPCModel extends StandardActorModel {
    static defineSchema() {
        let schema = super.defineSchema();

        schema.wounds = new fields.SchemaField({
            value: new fields.NumberField({min: 0, initial: 0}),
            unwounded: new fields.SchemaField({
                description: new fields.StringField(),
                effect: new fields.EmbeddedDataField(DocumentReferenceModel)
            }),
            wounded: new fields.SchemaField({
                threshold: new fields.NumberField({ initial: 1, min: 1 }),
                description: new fields.StringField(),
                effect: new fields.EmbeddedDataField(DocumentReferenceModel)
            }),
            defeated: new fields.SchemaField({
                threshold: new fields.NumberField({ initial: 2, min: 2 }),
                effect: new fields.EmbeddedDataField(DocumentReferenceModel)
            })
        })

        schema.type = new fields.StringField({ initial: "minion" });
        schema.resilience.fields.useItems = new fields.BooleanField({}, { name : "useItems", parent: schema.resilience });
        schema.resilience.fields.descriptor = new fields.StringField({}, { name : "descriptor", parent: schema.resilience });
        return schema;
    }

    computeBase() {
        super.computeBase();
        if (this.hasThresholds) 
        {
            this.computeWoundThresholds()
        }
    }

    addWound()
    {
        if (this.hasThresholds)
        {
            this.parent.createEmbeddedDocuments("Item", [{type : "wound", name : "Wound"}])
        }
        else 
        {
            super.addWound();
        }
    }

    get hasThresholds()
    {
        return ["brute", "monstrosity"].includes(this.type)
    }

    computeWoundThresholds()
    {
        let wounds = this.wounds;

        // Some things may only be considered wounded if it has 2 or more wounds
        if (wounds.wounded.threshold > 1) {
            wounds.unwounded.range = [0, wounds.wounded.threshold - 1]
        }
        else // otherwise, only unwounded if 0 wounds
        {
            wounds.unwounded.range = [0, 0]
        }

        // If defeated threshold is simply 1 wound more than wounded, the wounded range is only 1 value
        if (wounds.defeated.threshold == wounds.wounded.threshold + 1) {
            wounds.wounded.range = [wounds.wounded.threshold, wounds.wounded.threshold]
        }
        else // otherwise, wounded range is greater
        {
            wounds.wounded.range = [wounds.wounded.threshold, wounds.defeated.threshold - 1]
        }

        wounds.defeated.range = [wounds.defeated.threshold, wounds.defeated.threshold]

        // Compute active bracket
        let numberOfWounds = this.parent.itemTypes.wound.length;

        if (numberOfWounds >= wounds.unwounded.range[0]  && numberOfWounds <= wounds.unwounded.range[1])
        {
            wounds.unwounded.active = true;
        }
        
        else if (numberOfWounds >= wounds.wounded.range[0]  && numberOfWounds <= wounds.wounded.range[1])
        {
            wounds.wounded.active = true;
        }

        else if (numberOfWounds >= wounds.defeated.range[0]  && numberOfWounds <= wounds.defeated.range[1])
        {
            wounds.defeated.active = true;
        }
    }

    effectIsActive(effect)
    {
        if (this.hasThresholds && [this.wounds.unwounded.effect.id, this.wounds.wounded.effect.id, this.wounds.defeated.effect.id].includes(effect.id))
        {
            if (this.wounds.unwounded.active && this.wounds.unwounded.effect.id == effect.id)
            {
                return true;
            }
            else if (this.wounds.wounded.active && this.wounds.wounded.effect.id == effect.id)
            {
                return true;
            }
            else if (this.wounds.defeated.active && this.wounds.defeated.effect.id == effect.id)
            {
                return true;
            }
            return false;
        }
        else return true;
    }

    _addModelProperties() {
        this.wounds.unwounded.effect.relative = this.parent.effects;
        this.wounds.wounded.effect.relative = this.parent.effects;
    }

    async toEmbed(config, options)
    {

        if (config.table)
        {
            let html = `
            <div class="npc-table">
                
                <div class="header">
                    <label class="title"><a data-link data-uuid="${this.parent.uuid}">${config.label || this.parent.name}</a></label>
                </div>

                <div class="details">
                    <div class="property-header" style="padding-top: 20px; grid-column: 1 / span 1">WS</div>
                    <div class="property-header" style="padding-top: 20px; grid-column: 2 / span 1">BS</div>
                    <div class="property-header" style="padding-top: 20px; grid-column: 3 / span 1">S</div>
                    <div class="property-header" style="padding-top: 20px; grid-column: 4 / span 1">T</div>
                    <div class="property-header" style="padding-top: 20px; grid-column: 5 / span 1">I</div>
                    <div class="property-header" style="padding-top: 20px; grid-column: 6 / span 1">Ag</div>
                    <div class="property-header" style="padding-top: 20px; grid-column: 7 / span 1">Re</div>
                    <div class="property-header" style="padding-top: 20px; grid-column: 8 / span 1">Fel</div>

                    <div class="property" style="grid-column: 1 / span 1">${this.characteristics.ws.value}</div>
                    <div class="property" style="grid-column: 2 / span 1">${this.characteristics.bs.value}</div>
                    <div class="property" style="grid-column: 3 / span 1">${this.characteristics.s.value}</div>
                    <div class="property" style="grid-column: 4 / span 1">${this.characteristics.t.value}</div>
                    <div class="property" style="grid-column: 5 / span 1">${this.characteristics.i.value}</div>
                    <div class="property" style="grid-column: 6 / span 1">${this.characteristics.ag.value}</div>
                    <div class="property" style="grid-column: 7 / span 1">${this.characteristics.re.value}</div>
                    <div class="property" style="grid-column: 8 / span 1">${this.characteristics.fel.value}</div>

                    <div class="property-header" style="grid-column: 1 / span 3">Speed</div>
                    <div class="property-header" style="grid-column: 4 / span 3">Resilience</div>
                    <div class="property-header" style="grid-column: 7 / span 2">Type</div>

                    <div class="property" style="grid-column: 1 / span 3">${game.oldworld.config.speed[this.speed.value]}</div>
                    <div class="property" style="grid-column: 4 / span 3">${this.resilience.value} ${this.resilience.armoured ? "(armoured)" : ""}</div>
                    <div class="property" style="grid-column: 7 / span 2">${game.oldworld.config.npcType[this.type]}</div>

                    ${
                        ["brute", "monstrosity"].includes(this.type) ?
                        `<div class="property-header" style="grid-column: 1 / span 3">${this.wounds.unwounded.range[0]} ${this.wounds.unwounded.range[0] != this.wounds.unwounded.range[0] ? "-" + this.wounds.unwounded.range[1] : ""} Wounds</div>
                        <div class="property-header" style="grid-column: 4 / span 3">${this.wounds.wounded.range[0]} ${this.wounds.wounded.range[0] != this.wounds.wounded.range[0] ? "-" + this.wounds.wounded.range[1] : ""} Wounds</div>
                        <div class="property-header" style="grid-column: 7 / span 2">${this.wounds.defeated.range[0]} ${this.wounds.defeated.range[0] != this.wounds.defeated.range[0] ? "-" + this.wounds.defeated.range[1] : ""} Wounds</div>
            
                        <div class="property" style="grid-column: 1 / span 3">${this.wounds.unwounded.description || "–"}</div>
                        <div class="property" style="grid-column: 4 / span 3">${this.wounds.wounded.description || "–"}</div>
                        <div class="property" style="grid-column: 7 / span 2">Defeated</div>`
                        :
                        ""
                    }



                    <div class="text alt-row" style="grid-column: 1 / span 8">
                        <p><strong>Skills</strong>: ${Object.keys(this.skills).map(i => {
                            return `${game.oldworld.config.skills[i]} ${this.skills[i].value}`
                        }).join(", ")}</p>

                        <p><strong>Attacks</strong>: ${this.parent.itemTypes.weapon.map(weapon => {
                            return `@UUID[${weapon.uuid}]{${weapon.name}}`
                        }).join(", ")}</p>
                    </div>

                    <div class="traits" style="grid-column: 1 / span 8">
                    ${this.parent.itemTypes.ability.map(ability => {
                        return `<p>@UUID[${ability.uuid}]{${ability.name}}:  ${ability.system.description.public.replace("<p>", "")}`
                    }).join("")}
                    </div>

                    <div class="trappings alt-row   " style="grid-column: 1 / span 8">
                        <p><strong>Typical Trappings</strong>: ${this.parent.itemTypes.weapon.concat(this.parent.itemTypes.trapping).concat(this.parent.itemTypes.armour).map(i => `@UUID[${i.uuid}]{${i.name}}`).join(", ")}
                    </div>

                </div>
            </div>

            `

            if (config.image)
            {
                html = `<div class="npc-image"><img src="${this.parent.img}"></div>` + html;
            }

            let div = document.createElement("div");
            div.style = config.style;
            div.innerHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(`${html}`, {relativeTo : this, async: true, secrets : options.secrets})
            return div;
        }

    }

}

