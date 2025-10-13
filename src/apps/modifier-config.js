export default class ModifierConfig extends WHFormApplication
{
    static DEFAULT_OPTIONS = {
        tag: "form",
        classes: ["whtow","warhammer", "modifier-config"],
        window: {
            title: "TOW.ModifierConfig",
            contentClasses : ["standard-form"],
            resizable : true,
        },
        position : {
            width: 700
        },
    }

    /** @override */
    static PARTS = {
        form: {
            template: "systems/whtow/templates/apps/modifier-config.hbs",
            scrollable: [""],
            classes: ["standard-form"]
        },
        footer : {
            template : "templates/generic/form-footer.hbs"
        }
    };

    async _prepareContext(options) {
        let context = await super._prepareContext(options);
        context.subjects = {
            attacker : "Attacker is...",
            defender : "Defender is...",
        },
        context.conditions = {
            staggered : "Staggered",
            armoured : "Armoured",
            mounted : "Mounted"
        }

        context.system = this.document.system;
        return context;
    }


}