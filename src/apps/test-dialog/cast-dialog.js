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

    get casting()
    {
        return true;
    }

    get isCasting()
    {
        return true;
    }

    static PARTS = {
        fields : {
            template : "systems/whtow/templates/apps/test-dialog/test-dialog.hbs",
            fields: true
        },
        spell : {
            template : "systems/whtow/templates/apps/test-dialog/cast-dialog.hbs",
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
            this.tooltips.add("grim", 1,  game.i18n.localize("TOW.Tooltips.WearingArmour"))
            this.fields.grim++;
        }

        this.tooltips.start(this)
        this.fields.bonus += (this.fields.mixing || 0)
        this.tooltips.finish(this, game.i18n.localize("TOW.Tooltips.Mixing"))

        await super.computeFields();
    }
    
    /**
     * 
     * @param {object} actor Actor performing the test
     * @param {object} data Dialog data, such as title and actor
     * @param {object} fields Predefine dialog fields
     */
    static async setupData({spell, lore}, actor, context={}, options={})
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

        if (!lore && spell)
        {
            lore = spell.system.lore;
        }

        if (!lore || lore == "none")
        {
            return ui.notifications.error("Must provide a lore to roll a Casting Test")
        }

        context.lore = lore;
        context.itemUuid = spell?.uuid;

        context.appendTitle = context.appendTitle || ` - ${game.oldworld.config.magicLore[lore]}`;

        let dialogData = await super.setupData(skill, actor, context, options);
        dialogData.data.scripts = dialogData.data.scripts.concat(spell?.getScripts("dialog").filter(s => !s.options.defending) || [])
        dialogData.data.spell = spell;

        return dialogData;
    }

}