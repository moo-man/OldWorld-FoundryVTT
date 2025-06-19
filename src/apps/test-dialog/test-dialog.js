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
            modifier: {
                label: "Modifier",
                type: 1,
                path: "fields.modifier",
                hideLabel: true
            },
            slBonus: {
                label: "DIALOG.SLBonus",
                type: 1,
                path: "fields.slBonus"
            },
            successBonus: {
                label: "DIALOG.SuccessBonus",
                type: 1,
                path: "fields.successBonus"
            },
            difficulty: {
                label: "Difficulty",
                type: 0,
                path: "fields.difficulty"
            }
        }
    }
    
    static PARTS = {
        fields : {
            template : "systems/whtow/templates/apps/test-dialog/test-dialog.hbs",
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

    _defaultFields() 
    {
        return foundry.utils.mergeObject(super._defaultFields(), {
            bonus : 0,
            penalty : 0,
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
    }

    computeState()
    {

        if (this.data.grim > 0 && this.data.glorious > 0)
        {
            this.fields.state = "normal";
        }
        else if (this.data.grim > 0 && this.data.glorious <= 0) 
        {
            this.fields.state = "grim";
        }
        else if (this.data.glorious > 0 && this.data.grim <= 0)
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

        dialogData.data.glorious = context.glorious || 0;
        dialogData.data.grim = context.grim || 0;
        dialogData.data.dice = actor.system.characteristics[dialogData.data.characteristic].base;
        dialogData.fields.target = actor.system.skills[skill].base;



        return dialogData;
    }

}