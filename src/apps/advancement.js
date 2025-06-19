export class AdvancementForm extends HandlebarsApplicationMixin(ApplicationV2)
{
    static DEFAULT_OPTIONS = {
        tag: "form",
        classes: ["whtow", "warhammer", "advancement"],
        window: {
            title: "TOW.Advancement",
            contentClasses: ["standard-form"],
            resizable : true
        },
        position: {
            height: 600,
            width: 500
        },
        form: {
            handler: this.submit,
            submitOnChange: false,
            closeOnSubmit: true
        },
        actions: {
            stepValue: this._onStepValue,
            togglePip : this._onTogglePip,
            advanceSkill : this._onAdvanceSkill
        }
    };



    static TABS = {
        sheet: {
            tabs: [
                { id: "characteristics", label: "TOW.Sheet.Characteristics" },
                { id: "skills", label: "TOW.Sheet.Skills" },
                { id: "items", label: "TOW.Sheet.Items" },
                { id: "log", label: "TOW.Sheet.Log" },
                { id: "other", label: "TOW.Sheet.Offsets" }
            ],
            initial: "characteristics"
        }
    }


    static PARTS = {
        tabs: { scrollable: [""], template: 'templates/generic/tab-navigation.hbs' },

        form: {
            template: "systems/whtow/templates/apps/advancement.hbs",
            scrollable: [],
        },
        footer: {
            template: "templates/generic/form-footer.hbs"
        }
    };

    constructor(actor, options) {
        super(options);
        this.actorCopy = actor.clone();
        this.document = actor;
    }


    async _prepareContext(options) 
    {
        let context = await super._prepareContext(options);

        context.actor = this.actorCopy;
        context.document = this.document;
        context.talents = this.actorCopy.itemTypes.talent;
        context.skills = context.actor.system.skills.toJSON();

        for(let s of Object.values(context.skills))
        {
            s.value = s.base + s.advances
            s.pips = Array(7).fill(undefined).map((_, index) => {
                return {active : s.improvement > index, unavailable : index >  s.value}
            })
        }

        context.buttons = [{ type: "submit", label: "Submit" }];
        return context;
    }

    static submit(ev, form, formData) 
    {
        this.document.update(this.actorCopy.toObject());
    }

    static _onStepValue(ev, target) 
    {
        let value = target.dataset.type == "increase" ? 1 : -1;
        let characteristic = target.dataset.characteristic;

        if (characteristic) 
        {
            this.actorCopy.updateSource({ [`system.characteristics.${characteristic}.advances`]: this.actorCopy.system.characteristics[characteristic].advances + value });
        }

        this.render({force : true})
    }

    static _onEditBase(ev, target)
    {
        let characteristic = target.dataset.characteristic;
        this.actorCopy.updateSource({ [`system.characteristics.${characteristic}.base`]: target.value});
        this.render({force : true})
    }

    static _onTogglePip(ev, target)
    {
        if (game.user.isGM)
        {
            let index = Number(target.dataset.index)
            let skill = target.closest("[data-skill]").dataset.skill;
            let value = this.actorCopy.system.skills[skill].improvement == index + 1 ? index : index + 1;
            this.actorCopy.updateSource({[`system.skills.${skill}.improvement`] : value})
            this.render({force : true})
        }
    }

    static _onAdvanceSkill(ev, target)
    {
        let skill = target.closest("[data-skill]").dataset.skill;
        let skillData = this.actorCopy.system.skills[skill];
        if (skillData.improvement > (skillData.base + skillData.advances))
        {
            skillData.advances++;
            skillData.improvement = 0;
        }
        this.actorCopy.updateSource({[`system.skills.${skill}`] : skillData});
        this.render({force : true})
    }

    async _onRender(options)
    {
        await super._onRender(options);

        this.element.querySelectorAll("[data-action='editBase']").forEach(e => e.addEventListener("change", (ev) => (this.constructor._onEditBase.bind(this))(ev, e)));
    }

}