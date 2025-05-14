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
            container : {id : "base", classes : ["dialog-base"]}
        },
        modifiers : {
            template : "modules/warhammer-lib/templates/partials/dialog-modifiers.hbs",
            container : {id : "base", classes : ["dialog-base"]}
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
            penalty : 0
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
            value = this.fields[target.dataset.target] - 1;
        }
        else 
        {
            value = this.userEntry[target.dataset.target] - 1;
        }

        foundry.utils.setProperty(this.userEntry, target.dataset.target, value)
        this.render(true);
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

        context.title = context.title || game.i18n.format("SkillTest", {skill: skill.name});
        context.title += context.appendTitle || "";

        foundry.utils.mergeObject(dialogData.fields, context.fields);

        dialogData.data.dice = actor.system.characteristics[dialogData.data.characteristic].base;
        dialogData.fields.target = actor.system.skills[skill].base;

        return dialogData;
    }

}