import { BaseItemModel } from "./components/base";
import { TestModel } from "./components/test";

let fields = foundry.data.fields;
export class SpellModel extends BaseItemModel 
{
    static LOCALIZATION_PREFIXES = ["WH.Models.spell"]
    static defineSchema()
    {
        let schema = super.defineSchema();
        schema.cv = new fields.NumberField({min: 0});
        schema.successes = new fields.NumberField({min: 0});
        schema.lore = new fields.StringField({});
        schema.target = new fields.SchemaField({
            custom : new fields.StringField({}),
            value : new fields.StringField({})
        });
        schema.range = new fields.SchemaField({
            custom : new fields.StringField({}),
            value : new fields.StringField({})
        });
        schema.duration = new fields.SchemaField({
            custom : new fields.StringField({}),
            value : new fields.StringField({})
        });
        schema.damage = new fields.SchemaField({
            formula: new fields.StringField(),
            potency : new fields.BooleanField(),
            ignoreArmour : new fields.BooleanField()
        })
        schema.test = new fields.EmbeddedDataField(TestModel);
        return schema;
    }

    get progress()
    {
        if (this.parent.actor?.system.magic.casting.spell?.id == this.parent.id)
        {
            return this.parent.actor?.system.magic.casting.progress
        }
        else return 0
    }

    get isMagical()
    {
        return true;
    }

    async toEmbed(config, options)
    {
        let html = `
        <h5>@UUID[${this.parent.uuid}]{${this.parent.name}}</h5>
        <p><strong>CV</strong>: ${this.cv}\t<strong>Target</strong>: ${this.target.value ? game.oldworld.config.target[this.target.value] : this.target.custom}</p>
        <p><strong>Range</strong>: ${this.range.value ? game.oldworld.config.range[this.range.value] : this.range.custom}\t<strong>Duration</strong>: ${this.duration.value ? game.oldworld.config.duration[this.duration.value] : this.duration.custom}</p>
        <p><strong>Effect</strong>: ${this.description.public.replace("<p>", "")}
        `;
    
        let div = document.createElement("div");
        div.style = config.style;
        div.innerHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(`<div style="${config.style || ""}">${html}</div>`, {relativeTo : this, async: true, secrets : options.secrets})
        return div;
    }
}