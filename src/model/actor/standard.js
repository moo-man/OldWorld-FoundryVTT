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
        this.resilience.armour = 0;
        this.resilience.base = this.resilience.value
        try {
            this.parent.itemTypes.armour.filter(i => i.system.isEquipped).forEach(i => 
            {
                this.resilience.armour += Number(i.system.resilience ? (Roll.safeEval(Roll.replaceFormulaData(i.system.resilience, this.parent)) || 0) : 0)
                this.resilience.armoured = true;
            })

            this.resilience.value += this.resilience.armour;
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

    applyDamage(damage, {ignoreArmour, opposed, item, test})
    {
        let resilience = this.resilience.value;
        if (ignoreArmour)
        {
            resilience = this.resilience.base;
        }
        let message = ""

        this.parent.applyEffect({effects: test?.damageEffects || []});

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
            let name = (this.parent.getActiveTokens()[0] ?? this.prototypeToken).name
            ChatMessage.implementation.create({
                content: game.i18n.format(message, {name}),
                speaker : {
                    alias: name
                },
                flavor : game.i18n.localize("TOW.Chat.AppliedDamage") + ` (${damage})`
            })
        }
    }

    addWound()
    {
        let wounds = this.parent.itemTypes.wound;
        let formula = `${wounds.length + 1}d10`;
        return game.oldworld.tables.rollTable("wounds",  formula);
    }

    giveGround({flavor=""}={})
    {
        ChatMessage.implementation.create({
            content : "<strong>Give Ground!</strong>: Must retreat to an adjacent Zone.",
            speaker : {
                alias : (this.parent.getActiveTokens[0] || this.prototypeToken)?.name
            },
            flavor : flavor || game.i18n.localize("TOW.Dialog.Staggered")
        })
    }

    async fallProne({flavor=""}={})
    {
        ChatMessage.implementation.create({
            content : "<strong>Falls Prone!</strong>",
            speaker : {
                alias : (this.parent.getActiveTokens[0] || this.prototypeToken)?.name
            },
            flavor : flavor || game.i18n.localize("TOW.Dialog.Staggered")
        })
        await this.parent.addCondition("prone");

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
                window : {title : `${this.parent.name} - ${game.i18n.localize("TOW.Dialog.Staggered")}`},
                content : `<p>${game.i18n.localize("TOW.Dialog.StaggeredPrompt")}</p>`,
                buttons : buttons
            })

            switch (choice)
            {
                case "give" :
                    await this.giveGround();
                    break;
                case "wound" :
                    await this.addWound();
                    this.parent.removeCondition("staggered");
                    break;
                case "prone" :
                    await this.fallProne()
                    break;
            }

            return choice;
    }

    async doAction(action, subAction)
    {
        let actionData = foundry.utils.deepClone(game.oldworld.config.actions[action]);
        let subActionData = actionData.subActions?.[subAction];

        // Always prioritize subaction, if specified.
        let actionDataToUse = subActionData || actionData;

        if (actionDataToUse)
        {
            // If a script, ignore everything else and execute
            if (actionDataToUse.script)
            {
                actionDataToUse.script(this.parent);
            }
            // If test defined, perform test, add effect to actor if test is succeeded
            else if (!foundry.utils.isEmpty(actionDataToUse.test))
            {
                let skill = actionDataToUse.test.skill;
                if (actionDataToUse.test.chooseSkill)
                {
                    skill = await game.oldworld.utility.skillDialog({title : actionDataToUse.label, defaultValue: skill})
                }
                let test = await this.parent.setupSkillTest(skill, {action, subAction})
                if (actionDataToUse.effect && test.succeeded)
                {
                    this.parent.applyEffect({effectData : actionDataToUse.effect})
                }
            }
            // No test or script defined, just add effect to actor
            else if (actionDataToUse.effect)
            {
                this.parent.applyEffect({effectData : actionDataToUse.effect})
            }

            else if (!subAction && actionData.subActions)
            {
                let subActions = Object.keys(actionData.subActions).map(i => {return {id : i, name : actionData.subActions[i].label}});
                let chosenSubAction = (await ItemDialog.create(subActions, 1, {title : actionData.label, text : "Choose Action"}))[0].id;
                return this.doAction(action, chosenSubAction)
            }
            else {
                ActionUse.fromAction(action, this.parent, {subAction});
            }
        }
    }

    rollMiscast()
    {
        OldWorldTables.rollTable("miscast", `${this.magic.miscasts}d10`)
        this.parent.update({"system.magic.miscasts" : 0})
    }

    modifyMiscasts(value, messageData)
    {
        if (value == 0 || this.magic.miscasts == 0)
        {
            return;
        }
        this.parent.update({"system.magic.miscasts" : this.magic.miscasts + value});

        let content = (value > 0 ? "Added " : "Removed ") + Math.abs(value) + " Miscast " + (Math.abs(value) > 1 ? " Dice" : " Die");
        ChatMessage.create(foundry.utils.mergeObject({content, speaker: {alias: this.parent.name}}, messageData))
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
        return this.parent.statuses.has("staggered");
    }
    get isProne() 
    {
        return this.parent.statuses.has("prone");
    }
    get isMounted() 
    {

    }
}

