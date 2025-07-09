export default class TemptationDialog extends HandlebarsApplicationMixin(ApplicationV2)
{
    static DEFAULT_OPTIONS = {
        tag: "form",
        classes: ["whtow","warhammer", "temptation"],
        window: {
            title: "TOW.Dialog.Temptation",
            contentClasses : ["standard-form"],
            resizable : true,
        },
        position : {
            width: 400
        },
        form: {
            submitOnChange: false,
            closeOnSubmit : true,
            handler: this.submit
        },
        actions : {
            reset : this._onReset
        }
    }

    /** @override */
    static PARTS = {
        form: {
            template: "systems/whtow/templates/apps/temptation.hbs",
            scrollable: [""],
            classes: ["standard-form"]
        },
        footer : {
            template : "templates/generic/form-footer.hbs"
        }
    };

    static #schema = new foundry.data.fields.SchemaField({
        wounds : new foundry.data.fields.StringField({initial : "", label : "TOW.TableSetting.wounds"}),
        miscast : new foundry.data.fields.StringField({initial : "", label : "TOW.TableSetting.miscast"}),
    })

    static get schema()
    {
        Hooks.call("TOW.tableSettingSchema", this.#schema)
        return this.#schema
    }

    async _prepareContext(options) {
        let context = await super._prepareContext(options);
        context.settings = game.settings.get("whtow", "tableSettings");
        context.schema = this.constructor.schema;
        context.tables = game.tables.contents.reduce((tables, t) => {tables[t._id] = t.name; return tables}, {});
        context.buttons = [
            {
              type: "button",
              icon: "fa-solid fa-arrow-rotate-left",
              label: "Reset",
              action: "reset"
            },
            {type: "submit", icon: "fa-solid fa-floppy-disk", label: "SETTINGS.Save"}]
        return context
    }


    static async submit(event, form, formData) {
        return game.settings.set("whtow", "tableSettings", formData.object)
    }

    static async _onReset(ev, target)
    {
        let defaults = {};

        for(let setting in this.constructor.schema.fields)
        {
            defaults[setting] = this.constructor.schema.fields[setting].initial;
        }

        await game.settings.set("whtow", "tableSettings", defaults)
        this.render(true);
    }

}