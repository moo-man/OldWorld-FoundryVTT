import TestDialog from "./test-dialog";

export default class WeaponDialog extends TestDialog
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
        classes: ["weapon-dialog"]
    };

    _defaultFields() 
    {
        return foundry.utils.mergeObject(super._defaultFields(), {
            charging:  false,
            damage: 0,
        });
    }

    get weapon()
    {
        return this.data.weapon;
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
        this.fields.damage = this.weapon.system.damage.value;
        this.tooltips.set("damage", this.weapon.system.damage.formula, this.weapon.name);
        if (this.weapon.system.damage.characteristic)
        {
            this.tooltips.add("damage", this.actor.system.characteristics[this.weapon.system.damage.characteristic].value, game.oldworld.config.characteristics[this.weapon.system.damage.characteristic]);
        }
    }

    static PARTS = {
        fields : {
            template : "systems/whtow/templates/apps/test-dialog/test-dialog.hbs",
            fields: true
        },
        weapon : {
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
    static async setupData(weapon, actor, context={}, options={})
    {
        if (typeof weapon == "string")
        {
            if (weapon.includes("."))
            {
                weapon = await fromUuid(weapon);
            }
            else 
            {
                weapon = actor.items.get(weapon);
            }
        }

        if (!weapon.system.isLoaded)
        {
            return weapon.system.rollReloadTest(actor);
        }

        let skill = weapon.system.skill;

        if (actor.system.opposed)
        {
            skill = "defence";
        }

        context.title = context.title || game.i18n.format("TOW.Test.SkillTest", {skill : game.oldworld.config.skills[skill]});
        context.title += context.appendTitle || "";

        context.itemUuid = weapon.uuid;
        
        let dialogData = super.setupData(skill, actor, context, options);
        
        dialogData.data.weapon = weapon;
        dialogData.data.scripts = dialogData.data.scripts.concat(weapon?.getScripts("dialog").filter(s => !s.options.defending) || [])

        return dialogData;
    }

}