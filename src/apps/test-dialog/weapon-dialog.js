import TestDialog from "./test-dialog";

export default class WeaponDialog extends TestDialog
{

    subTemplate = "systems/whtow/templates/apps/test-dialog/weapon-dialog.hbs"

    static DEFAULT_OPTIONS = {
        classes: ["weapon-dialog"]
    };

    _defaultFields() 
    {
        return foundry.utils.mergeObject(super._defaultFields(), {
            charging:  false
        });
    }

    

    async computeFields() 
    {
        this.computeState();
        if (this.fields.charging)
        {
            this.fields.bonus++;
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

        return dialogData;
    }

}