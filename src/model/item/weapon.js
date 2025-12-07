import { DamageModel } from "./components/damage";
import { EquippableItem } from "./components/equippable";
import { ModifiersModel } from "./components/modifier";
import { PhysicalItem } from "./components/physical";
import { TestModel } from "./components/test";
let fields = foundry.data.fields;

export class WeaponModel extends EquippableItem 
{
    static LOCALIZATION_PREFIXES = ["WH.Models.weapon"]
    static defineSchema()
    {
        let schema = super.defineSchema();
        schema.skill = new fields.StringField({choices : {melee : "TOW.Melee", brawn : "TOW.Brawn", shooting : "TOW.Shooting", throwing : "TOW.Throwing"}, initial : "melee"})
        schema.range = new fields.SchemaField({
            min : new fields.NumberField({choices : game.oldworld.config.range, initial : 0}),
            max : new fields.NumberField({choices : game.oldworld.config.range, initial : 0}),
            melee : new fields.NumberField({choices : game.oldworld.config.range, initial : 0}),
        })
        schema.modifiers = new fields.EmbeddedDataField(ModifiersModel)
        schema.test = new fields.EmbeddedDataField(TestModel);
        schema.damage = new fields.EmbeddedDataField(DamageModel);
        schema.grip = new fields.StringField({choices : {"1H" : "1H", "2H" : "2H"}, initial : "1H"}),
        schema.traits = new fields.StringField({});
        schema.reload = new fields.SchemaField({
            current : new fields.NumberField({min: 0, initial: 0}),
            value : new fields.NumberField({min: 0}),
            optional : new fields.BooleanField()
        })
        return schema;
    }

    get isMelee()
    {
        return ["melee", "brawn"].includes(this.skill);
    }

    get isRanged()
    {
        return ["shooting", "throwing"].includes(this.skill);
    }

    get isLoaded()
    {
        return !this.requiresLoading || this.reload.current >= this.reload.value;
    }

    get isMagical()
    {
        return this.damage.magical;
    }

    rollReloadTest(actor)  
    {
        return actor.setupSkillTest("dexterity", {reload: this.parent, appendTitle: ` - Reloading ${this.parent.name}`});
    }

    get requiresLoading()
    {
        return this.reload.value > 0;
    }

    computeOwned(actor) 
    {
        this.damage.compute(actor);
        super.computeOwned(actor);
    }

    getOtherEffects()
    {
        let scripts = this.modifiers.createScripts();

        if (scripts.length && this.isEquipped)
        {
            return [new ActiveEffect.implementation({
                name : this.parent.name,
                img : this.parent.img,
                system : {
                    scriptData : scripts
                }
            }, {parent : this.parent})]
        }
        else return [];

    }

    async toEmbed(config, options)
    {
        if (config.row)
        {

            let html = `
                <div style>
                    @UUID[${this.parent.uuid}]{${this.parent.name}}
                </div>
                <div>
                    ${this.cost ? game.oldworld.config.status[this.cost] : "n/a"}
                </div>
                <div>
                    ${this.isMelee ? game.oldworld.config.range[this.range.melee] : `${game.oldworld.config.range[this.range.min]}-${game.oldworld.config.range[this.range.max]}`}
                </div>
                <div>
                    ${this.damage.characteristic ? this.damage.characteristic.toUpperCase() + ((this.damage.formula && "+") || "") : ""}${this.damage.formula}
                </div>
                <div>
                    ${this.grip}
                </div>
                <div>
                    ${this.traits}
                </div>
            `;
        
            let div = document.createElement("div");
            div.style = config.style;
            div.style.display = "flex";
            div.classList.add("embed-row");
            div.innerHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(html, {relativeTo : this, async: true, secrets : options.secrets})
            return div;
        }
        else 
        {

            let html = `
            <h3>@UUID[${this.parent.uuid}]{${config.label || this.parent.name}}</h3>
            ${this.description.public}
            <section class="tow-table">
            <table>
                <tbody>
                    <tr>
                        <th>
                            <p style="text-align: center">${this.isRanged ? "Optimum Range" : "Max Range"}</p>
                        </th>
                        <th>
                            <p style="text-align: center">Damage</p>
                        </th>
                        <th>
                            <p style="text-align: center">1H/2H</p>
                        </th>
                        <th>
                            <p>Traits</p>
                        </th>
                    </tr>
                    <tr>
                        <td>
                            <p style="text-align: center">${this.isRanged ? `${game.oldworld.config.range[this.range.min]} - ${game.oldworld.config.range[this.range.max]}` : game.oldworld.config.range[this.range.melee]}</p>
                        </td>
                        <td>
                            <p style="text-align: center">${this.damage.formula} ${this.damage.characteristic ? "+" + this.damage.characteristic : ""}</p>
                        </td>
                        <td>
                            <p style="text-align: center">${this.grip}</p>
                        </td>
                        <td>
                            <p>${this.traits}</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
        `;

            let div = document.createElement("div");
            div.style = config.style;
            div.innerHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(html, {relativeTo : this, async: true, secrets : options.secrets})
            return div;

        }

    }
}