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
            advanceSkill : this._onAdvanceSkill,
            editSkill : this._onEditSkill,
            rollTest : this._onRollTest,
            deleteLog: this.deleteLog,
            deleteOffset : this.deleteOffset
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
        context.skills = context.actor.system.skills.toObject();

        // Weird but check prepared skills improvement (preparation ensures the value doesn't go above what's allowed)
        let prepSkills = context.actor.system.skills.toObject(false);
        
        for(let s of Object.keys(context.skills))
        {   
            let skill = context.skills[s];
            skill.value = skill.base + skill.advances
            skill.pips = Array(7).fill(undefined).map((_, index) => {
                return {active : prepSkills[s].improvement > index, unavailable : index >  skill.value}
            })
        }

        context.buttons = [{ type: "submit", label: "Submit" }];
        return context;
    }

    static submit(ev, form, formData) 
    {
        this.document.update(this.actorCopy.toObject(), {skipXPCheck : true});
    }

    static _onStepValue(ev, target) 
    {
        let value = target.dataset.type == "increase" ? 1 : -1;
        let characteristic = target.dataset.characteristic;
        let skill = target.dataset.skill;

        if (characteristic) 
        {
            this.actorCopy.updateSource({ [`system.characteristics.${characteristic}.advances`]: this.actorCopy.system.characteristics[characteristic].advances + value });
        }
        else if (skill)
        {
            this.actorCopy.updateSource({ [`system.characteristics.${skill}.advances`]: this.actorCopy.system.skills[skills].advances + value });
        }

        this.render({force : true})
    }

    static _onEditProperty(ev, target)
    {
        let property = target.dataset.property
        if (target.dataset.type == "skill")
        {
            this.actorCopy.updateSource({ [`system.skills.${target.dataset.skill}.${property}`]: target.value });
        }
        else if (target.dataset.characteristic)
        {
            this.actorCopy.updateSource({ [`system.characteristics.${target.dataset.characteristic}.${property}`]: target.value});
        }
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
        this.document.update({[`system.skills.${skill}`] : skillData});
        this.render({force : true})
    }

    static _onEditSkill(ev, target)
    {

    }

    static updateLog(ev, target)
    {
        let index = Number(target.closest("[data-index]").dataset.index);
        this.actorCopy.updateSource(this.actorCopy.system.xp.log.edit(index, {reason: target.value}));
        this.render({force : true})
    }
    static deleteLog(ev, target)
    {
        let index = Number(target.closest("[data-index]").dataset.index);
        let data = this.actorCopy.system.xp.log.list[index];
        let newTotal = this.actorCopy.system.xp.total - (data.amount || 0);
        this.actorCopy.updateSource(this.actorCopy.system.xp.log.remove(index));
        this.actorCopy.updateSource({"system.xp.total" : newTotal});
        this.render({force : true})
    }

    static updateOffset(ev, target)
    {
        let index = Number(target.closest("[data-index]")?.dataset.index);
        let path = target.dataset.path;

        if (isNaN(index))
        {
            this.actorCopy.updateSource(this.actorCopy.system.xp.offsets.add({[`${path}`]: target.value}));
        }
        else 
        {
            this.actorCopy.updateSource(this.actorCopy.system.xp.offsets.edit(index, {[`${path}`]: target.value}));
        }
        this.render({force : true})
    }

    static deleteOffset(ev, target)
    {
        let index = Number(target.closest("[data-index]").dataset.index);
        this.actorCopy.updateSource(this.actorCopy.system.xp.offsets.remove(index));
        this.render({force : true})
    }

    async _onRender(options)
    {
        await super._onRender(options);

        this.element.querySelectorAll("[data-action='editProperty']").forEach(e => e.addEventListener("change", (ev) => (this.constructor._onEditProperty.bind(this))(ev, e)));
        this.element.querySelectorAll("[data-action='updateLog']").forEach(e => e.addEventListener("change", (ev) => (this.constructor.updateLog.bind(this))(ev, e)));
        this.element.querySelectorAll("[data-action='updateOffset']").forEach(e => e.addEventListener("change", (ev) => (this.constructor.updateOffset.bind(this))(ev, e)));
    }

    static async _onRollTest(ev, target)
    {
        let skill = target.closest("[data-skill]").dataset.skill;
        await this.document.setupSkillTest(skill, {endeavour : true})

        this.actorCopy.updateSource({[`system.skills.${skill}.improvement`] : this.document.system.skills[skill].improvement});
        this.render({force : true})
    }

}