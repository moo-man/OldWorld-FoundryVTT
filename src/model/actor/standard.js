import OldWorldTables from "../../system/tables";
import { ItemUse } from "../../system/tests/item-use";
import { BaseActorModel } from "./base";
import { BlessedDataModel } from "./components/blessed";
import { CharacteristicsModel } from "./components/characteristics";
import { CorruptionDataModel } from "./components/corruption";
import { MagicDataModel } from "./components/magic";
import { NPCCharacteristicsModel } from "./components/npc-characteristics";
import { NPCSkillsModel } from "./components/npc-skills";
import { SkillsModel } from "./components/skills";
let fields = foundry.data.fields;

/**
 * Represents actors that have characteristics and skills
 * Encompasses player characters and NPCs
 */
export class StandardActorModel extends BaseActorModel 
{
    static singletonItemPaths = {
        "blessing" : "blessed",
        "corruption" : "corruption"
    };
    
    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.characteristics = new fields.EmbeddedDataField(NPCCharacteristicsModel);
        schema.skills = new fields.EmbeddedDataField(NPCSkillsModel);
        schema.speed = new fields.SchemaField({
            value : new fields.StringField({initial : "normal"}),
            modifier : new fields.NumberField({initial : 0, min: 0})
        })
        schema.resilience = new fields.SchemaField({
            value : new fields.NumberField(),
            modifier : new fields.NumberField({initial: 0}),
        }),
        schema.magic = new fields.EmbeddedDataField(MagicDataModel)
        schema.blessed = new fields.EmbeddedDataField(BlessedDataModel)
        schema.corruption = new fields.EmbeddedDataField(CorruptionDataModel)
        return schema;
    }

    async _preUpdate(data, options, user)
    {
        await super._preUpdate(data, options, user);

    }

    async _onUpdate(data, options, user)
    {
        await super._onUpdate(data, options, user);
    }
    
    computeBase() 
    {
        this.excludeStaggeredOptions = [];
        super.computeBase();
        this.characteristics.compute();
        this.skills.compute();
        this.resilience.value = 0;
        this.magic.lores = this._handleLores();
    }
    computeDerived()
    {
        super.computeDerived();
        this.resilience.value += this.characteristics.t.value + this.resilience.modifier;   
        try {
            this.parent.itemTypes.armour.filter(i => i.system.isEquipped).forEach(i => 
            {
                this.resilience.value +=  Number(i.system.resilience ? (Roll.safeEval(Roll.replaceFormulaData(i.system.resilience, this.parent)) || 0) : 0)
                this.resilience.armoured = true;
            })
        }
        catch(e)
        {
            console.error(`(${this.parent.name}) Error when computing resilience: ` + e)
        }
    }

        
    _addModelProperties()
    {
        super._addModelProperties();
    }

    applyDamage(damage, {opposed, item})
    {
        let resilience = this.resilience.value;
        let message = ""

        if (damage > resilience)
        {
            this.addWound();
            message = `TOW.Chat.TakesWound`
        }
        else 
        {
            this.parent.addCondition("staggered");
            message = `TOW.Chat.GainsStaggered`
        }
        if (opposed)
        {
            let owner = warhammer.utility.getActiveDocumentOwner(opposed.parent)
            if (owner.id == game.user.id)
            {
                opposed.updateAppliedDamage(message)
            }
            else 
            {
                owner.query("updateAppliedDamage", {id : opposed.parent.id, message})
            }
        }
        else 
        {
            let name = (this.getActiveTokens()[0] ?? this.prototypeToken).name
            ChatMessag.implementation.create({
                content: game.i18n.format(message, {name}),
                speaker : {
                    alias: name
                },
                flavor : game.i18n.localize("TOW.Chat.AppliedDamage")
            })
        }
    }

    addWound()
    {
        let wounds = this.parent.itemTypes.wound;
        let formula = `${wounds.length + 1}d10`;
        return game.oldworld.tables.rollTable("wounds",  formula);
    }

    giveGround()
    {
        ChatMessage.implementation.create({
            content : "<strong>Give Ground!</strong>: Must retreat to an adjacent Zone.",
            speaker : {
                alias : (this.parent.getActiveTokens[0] || this.prototypeToken)?.name
            },
            flavor : game.i18n.localize("TOW.Dialog.Staggered")
        })
    }

    async promptStaggeredChoice({excludeOptions=[], user}={})
    {
            let buttons = [
                {
                    action : "wound",
                    label : "Take a Wound",
                },
                {
                    action : "prone",
                    label : "Fall Prone"
                },
                {
                    action : "give",
                    label : "Give Ground"
                }                               // Must always have the option to a least take a wound
            ].filter(i => i.action == "wound" || !excludeOptions.includes(i.acton))

            let choice = await foundry.applications.api.Dialog.wait({
                window : {title : "TOW.Dialog.Staggered"},
                content : `<p>${game.i18n.localize("TOW.Dialog.StaggeredPrompt")}</p>`,
                buttons : buttons
            })

            switch (choice)
            {
                case "give" :
                    this.giveGround();
                    break;
                case "wound" :
                    this.addWound();
                    this.parent.removeCondition("staggered");
                    break;
                case "prone" :
                    this.parent.addCondition("prone");
                    ChatMessage.implementation.create({
                        content : "<strong>Falls Prone!</strong>",
                        speaker : {
                            alias : (this.parent.getActiveTokens[0] || this.prototypeToken)?.name
                        },
                        flavor : game.i18n.localize("TOW.Dialog.Staggered")
                    })
                    break;
            }

            return choice;
    }

    rollMiscast()
    {
        OldWorldTables.rollTable("miscast", `${this.magic.miscasts}d10`)
        this.parent.update({"system.magic.miscasts" : 0})
    }

    async castSpell(spell, potency, fromTest)
    {
        if (fromTest)
        {
            await this.clearCasting()
        }
        this.parent.useItem(spell, {potency, targets: fromTest ? fromTest.context.targetSpeakers : null})
    }

    clearCasting()
    {
        this.parent.update({"system.magic.casting" : {progress : 0, lore  : ""}});
    }

    _handleLores()
    {
        let spells = this.parent.itemTypes.spell;
        let lores = {
            none : {
                label : "No Lore Specified",
                spells : []
            }
        };
        for(let spell of spells)
        {
            let lore = spell.system.lore
            if (!lore)
            {
                lores.none.spells.push(spell);
            }
            else if (!lores[lore])
            {
                lores[lore] = {
                    spells : [spell],
                    label : game.oldworld.config.magicLore[spell.system.lore],
                    progress: 0
                }
            }
            else 
            {
                lores[lore].spells.push(spell);
            }
        }

        if (this.magic.casting.lore && lores[this.magic.casting.lore])
        {
            lores[this.magic.casting.lore].progress = this.magic.casting.progress;
        }

        return lores;
    }

    get isArmoured() 
    {
        return this.resilience.armoured;
    }
    get isStaggered() 
    {
        return this.parent.statuses.includes("staggered");
    }
    get isMounted() 
    {

    }
}

