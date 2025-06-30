import OldWorldTables from "../../system/tables";
import { ItemUse } from "../../system/tests/item-use";
import { BaseActorModel } from "./base";
import { CharacteristicsModel } from "./components/characteristics";
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
    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.characteristics = new fields.EmbeddedDataField(NPCCharacteristicsModel);
        schema.skills = new fields.EmbeddedDataField(NPCSkillsModel);
        schema.speed = new fields.SchemaField({
            land : new  fields.StringField({initial : "normal"}),
            fly : new  fields.StringField({initial : "none"})
        })
        schema.resilience = new fields.SchemaField({
            value : new fields.NumberField(),
        }),
        schema.magic = new fields.EmbeddedDataField(MagicDataModel)
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
    }
    computeDerived()
    {
        super.computeDerived();
        this.resilience.value += this.characteristics.t.value
        try {
            this.parent.itemTypes.armour.filter(i => i.system.isEquipped).forEach(i => this.resilience.value +=  Number((Roll.safeEval(Roll.replaceFormulaData(i.system.resilience, this.parent))) || 0))
        }
        catch(e)
        {
            console.error(`(${this.parent.name}) Error when computing resilience: ` + e)
        }
    }

        
    _addModelProperties()
    {
        super._addModelProperties();
        for(let cast of Object.values(this.magic.casting))
        {
            cast.spell.relative = this.parent.items;
        }
    }

    applyDamage(damage, {opposed})
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
        ChatMessage.implementation.create({
            content : "<strong>Takes a Wound!</strong>",
            speaker : {
                alias : (this.parent.getActiveTokens[0] || this.prototypeToken)?.name
            },
            flavor : game.i18n.localize("TOW.Dialog.Staggered")
        })
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

            this.parent.removeCondition("staggered");
            switch (choice)
            {
                case "give" :
                    this.giveGround();
                    break;
                case "wound" :
                    this.addWound();
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
        if(this.magic.casting.spell.id == spell.id)
        {
            await this.parent.update({"system.magic.casting" : {spell : {uuid : "", id : "", name : ""}, progress : 0}});
        }
        this.parent.useItem(spell, {potency, targets: fromTest ? fromTest.context.targetSpeakers : null})
    }
}

