import TestDialog from "./test-dialog";

export default class AbilityAttackDialog extends TestDialog
{

    get tooltipConfig() 
    {
        return foundry.utils.mergeObject(super.tooltipConfig, {
            damage: {
                label: "TOW.Damage",
                type: 1,
                path: "fields.damage",
                hideLabel : true
            },
        })
    }
    

    static DEFAULT_OPTIONS = {
        classes: ["ability-dialog"]
    };

    _defaultFields() 
    {
        return foundry.utils.mergeObject(super._defaultFields(), {
            charging:  false,
            damage: 0,
        });
    }

    get isAttack()
    {
        return true;
    }

    get attack()
    {
        return this.ability;
    }

    get ability()
    {
        return this.data.ability;
    }

    async computeFields() 
    {
        this.computeState();
        if (this.fields.charging)
        {
            this.fields.bonus++;
            this.tooltips.add("bonus", 1, game.i18n.localize("TOW.Dialog.Charging"));
        }

    }

    async computeInitialFields()
    {
        await super.computeInitialFields();
        this.fields.damage = this.ability.system.damage.value;
        this.tooltips.set("damage", this.ability.system.damage.formula, this.ability.name);
        if (this.ability.system.damage.characteristic)
        {
            this.tooltips.add("damage", this.actor.system.characteristics[this.ability.system.damage.characteristic].value, game.oldworld.config.characteristics[this.ability.system.damage.characteristic]);
        }
    }

    static PARTS = {
        fields : {
            template : "systems/whtow/templates/apps/test-dialog/test-dialog.hbs",
            fields: true
        },
        ability : {
            template : "systems/whtow/templates/apps/test-dialog/weapon-dialog.hbs",
            fields: true
        },
        modifiers : {
            template : "modules/warhammer-lib/templates/partials/dialog-modifiers.hbs",
            modifiers: true
        },
        mode : {
            template : "modules/warhammer-lib/templates/apps/dialog/dialog-mode.hbs",
        },
        footer : {
            template : "templates/generic/form-footer.hbs"
        }
    };

    /**
     * 
     * @param {object} actor Actor performing the test
     * @param {object} data Dialog data, such as title and actor
     * @param {object} fields Predefine dialog fields
     */
    static async setupData(ability, actor, context={}, options={})
    {
        if (typeof ability == "string")
        {
            if (ability.includes("."))
            {
                ability = await fromUuid(ability);
            }
            else 
            {
                ability = actor.items.get(ability);
            }
        }

        let skill = ability.system.attack.skill;

        if (actor.system.opposed)
        {
            skill = "defence";
        }

        context.title = context.title || game.i18n.format("TOW.Test.SkillTest", {skill : game.oldworld.config.skills[skill]});
        context.title += context.appendTitle || "";

        context.itemUuid = ability.uuid;
        
        let dialogData = await super.setupData(skill, actor, context, options);
        
        dialogData.data.ability = ability;
        dialogData.data.scripts = dialogData.data.scripts.concat(ability?.getScripts("dialog").filter(s => !s.options.defending) || [])

        return dialogData;
    }

}