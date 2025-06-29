import TestDialog from "./test-dialog";

export default class CastingDialog extends TestDialog
{

    static DEFAULT_OPTIONS = {
        classes: ["spell-dialog"]
    };

    get spell()
    {
        return this.data.spell;
    }

    static PARTS = {
        fields : {
            template : "systems/whtow/templates/apps/test-dialog/test-dialog.hbs",
            fields: true
        },
        spell : {
            template : "systems/whtow/templates/apps/test-dialog/spell-dialog.hbs",
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

    _defaultFields() 
    {
        return foundry.utils.mergeObject(super._defaultFields(), {
            mixing : 0
        });
    }

    

    async computeFields() 
    {
        if (this.actor.itemTypes.armour.some(a => a.system.isEquipped))
        {
            this.tooltips.add("grim", 1, "TOW.Tooltips.WearingArmour")
            this.data.grim++;
        }

        this.tooltips.start(this)
        this.fields.bonus += (this.fields.mixing || 0)
        this.tooltips.finish(this, "TOW.Tooltips.Mixing")

        await super.computeFields();
    }
    
    /**
     * 
     * @param {object} actor Actor performing the test
     * @param {object} data Dialog data, such as title and actor
     * @param {object} fields Predefine dialog fields
     */
    static async setupData(spell, actor, context={}, options={})
    {


        if (typeof spell == "string")
        {
            if (spell.includes("."))
            {
                spell = await fromUuid(spell);
            }
            else 
            {
                spell = actor.items.get(spell);
            }
        }

        let skill = "willpower"

        context.itemUuid = spell.uuid;

        let dialogData = super.setupData(skill, actor, context, options);

        dialogData.data.spell = spell;

        return dialogData;
    }

}