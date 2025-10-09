export default class TestDialog extends WarhammerRollDialogV2
{
    static DEFAULT_OPTIONS = {
        classes: ["test-dialog", "whtow"],
        tag : "form",
        form : {
            handler: this.submit,
            closeOnSubmit: true
        },
        actions: {
            inc : this._onInc,
            dec : this._onDec

        },
        window : {
            resizable : true
          },
    };


    get tooltipConfig()
    {
        return {
            bonus: {
                label: "TOW.Dialog.BonusDice",
                type: 1,
                path: "fields.bonus",
                hideLabel: true
            },
            penalty: {
                label: "TOW.Dialog.DicePenalty",
                type: 1,
                path: "fields.penalty"
            },
            glorious: {
                label: "TOW.Dialog.Glorious",
                type: 1,
                path: "fields.glorious"
            },
            grim: {
                label: "TOW.Dialog.Grim",
                type: 1,
                path: "fields.grim"
            }
        }
    }

    static PARTS = {
        fields : {
            template : "systems/whtow/templates/apps/test-dialog/test-dialog.hbs",
            fields: true
        },
        lores : {
            template : "systems/whtow/templates/apps/test-dialog/dialog-lores.hbs",
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

    get title()
    {
        return this.context.title;
    }

    get skill()
    {
        return this.data.skill;
    }

    get characteristic()
    {
        return this.data.characteristic;
    }

    get item()
    {
        return this.context.item;
    }

    _defaultFields()
    {
        return foundry.utils.mergeObject(super._defaultFields(), {
            bonus : 0,
            penalty : 0,
            glorious: 0,
            grim: 0,
            state : "normal"
        });
    }

    async _prepareContext(options)
    {
        let context = await super._prepareContext(options);

        context.dice = Array(context.data.dice).fill(null).map(i => {return {}});
        + context.fields.bonus

        context.dice = context.dice.concat(Array(context.fields.bonus).fill(null).map(i => {return {type : "bonus"}}));

        for(let i = 0; i < context.fields.penalty; i++)
        {
            if (context.dice[i])
            {
                context.dice[context.dice.length - (1 + i)] = {type : "penalty"};
            }
        }

        return context;
    }


    async computeFields()
    {
        this.computeState()
        if(this.fields.lore)
        {
            this.fields.bonus++;
            this.tooltips.add("bonus", 1, "Lore Bonus")
        }
    }

    async computeInitialFields()
    {
        this.data.dice = this.actor.system.characteristics[this.data.characteristic].value;
    }

    computeState()
    {

        if (this.fields.grim > 0 && this.fields.glorious > 0)
        {
            this.fields.state = "normal";
        }
        else if (this.fields.grim > 0 && this.fields.glorious <= 0)
        {
            this.fields.state = "grim";
        }
        else if (this.fields.glorious > 0 && this.fields.grim <= 0)
        {
            this.fields.state = "glorious";
        }

        if (this.userEntry.state)
        {
            this.fields.state = this.userEntry.state;
        }
    }

    static _onInc(ev, target)
    {
        let value;
        if (!(target.dataset.target in this.userEntry))
        {
            value = this.fields[target.dataset.target] + 1;
        }
        else
        {
            value = this.userEntry[target.dataset.target] + 1;
        }

        foundry.utils.setProperty(this.userEntry, target.dataset.target, value)
        this.render(true);
    }
    static _onDec(ev, target)
    {
        let value;
        if (!(target.dataset.target in this.userEntry))
        {
            value = Math.max(0, this.fields[target.dataset.target] - 1);
        }
        else
        {
            value = Math.max(0, this.userEntry[target.dataset.target] - 1);
        }

        foundry.utils.setProperty(this.userEntry, target.dataset.target, value)
        this.render(true);
    }

    _onFieldChange(ev)
    {
        // If the user clicks advantage or disadvantage, force that state to be true despite calculations
        if (ev.target.name == "state")
        {
            this.userEntry.state = ev.target.id;
            this.render(true);
        }
        else return super._onFieldChange(ev);
    }

    createBreakdown()
    {
        let breakdown = {modifiers : this.tooltips.getCollectedTooltips()};
        return breakdown;
    }


    /**
     *
     * @param {object} actor Actor performing the test
     * @param {object} data Dialog data, such as title and actor
     * @param {object} fields Predefine dialog fields
     */
    static setupData(skill, actor, context={}, options={})
    {

        let dialogData = super._baseDialogData(actor, context)

        dialogData.data.skill = skill;
        dialogData.data.characteristic = actor.system.skills[skill].characteristic;

        context.title = context.title || game.i18n.format("TOW.Test.SkillTest", {skill: game.oldworld.config.skills[skill]});
        context.title += context.appendTitle || "";

        context.defending = actor.system.opposed?.id;

        foundry.utils.mergeObject(dialogData.fields, context.fields);

        dialogData.data.item = context.item;
        if (context.item)
        {
            dialogData.context.itemUuid = context.item.uuid;
        }
        dialogData.fields.target = actor.system.skills[skill].value;



        return dialogData;
    }

}