import { StandardActorModel } from "./standard";
let fields = foundry.data.fields;

export class NPCModel extends StandardActorModel {
    static defineSchema() {
        let schema = super.defineSchema();

        schema.wounds = new fields.SchemaField({
            value: new fields.NumberField({min: 0, initial: 0}),
            unwounded: new fields.SchemaField({
                description: new fields.StringField(),
                effect: new fields.EmbeddedDataField(DocumentReferenceModel)
            }),
            wounded: new fields.SchemaField({
                threshold: new fields.NumberField({ initial: 1, min: 1 }),
                description: new fields.StringField(),
                effect: new fields.EmbeddedDataField(DocumentReferenceModel)
            }),
            defeated: new fields.SchemaField({
                threshold: new fields.NumberField({ initial: 2, min: 2 }),
                effect: new fields.EmbeddedDataField(DocumentReferenceModel)
            })
        })

        schema.type = new fields.StringField({ initial: "minion" });
        schema.resilience.fields.useItems = new fields.BooleanField({}, { name : "useItems", parent: schema.resilience });
        schema.resilience.fields.descriptor = new fields.StringField({}, { name : "descriptor", parent: schema.resilience });
        return schema;
    }

    computeBase() {
        super.computeBase();
        if (this.hasThresholds) 
        {
            this.computeWoundThresholds()
        }
    }

    addWound()
    {
        if (this.hasThresholds)
        {
            this.parent.createEmbeddedDocuments("Item", [{type : "wound", name : "Wound"}])
        }
        else 
        {
            super.addWound();
        }
    }

    get hasThresholds()
    {
        return ["brute", "monstrosity"].includes(this.type)
    }

    computeWoundThresholds()
    {
        let wounds = this.wounds;

        // Some things may only be considered wounded if it has 2 or more wounds
        if (wounds.wounded.threshold > 1) {
            wounds.unwounded.range = [0, wounds.wounded.threshold - 1]
        }
        else // otherwise, only unwounded if 0 wounds
        {
            wounds.unwounded.range = [0, 0]
        }

        // If defeated threshold is simply 1 wound more than wounded, the wounded range is only 1 value
        if (wounds.defeated.threshold == wounds.wounded.threshold + 1) {
            wounds.wounded.range = [wounds.wounded.threshold, wounds.wounded.threshold]
        }
        else // otherwise, wounded range is greater
        {
            wounds.wounded.range = [wounds.wounded.threshold, wounds.defeated.threshold - 1]
        }

        wounds.defeated.range = [wounds.defeated.threshold, wounds.defeated.threshold]

        // Compute active bracket
        let numberOfWounds = this.parent.itemTypes.wound.length;

        if (numberOfWounds >= wounds.unwounded.range[0]  && numberOfWounds <= wounds.unwounded.range[1])
        {
            wounds.unwounded.active = true;
        }
        
        else if (numberOfWounds >= wounds.wounded.range[0]  && numberOfWounds <= wounds.wounded.range[1])
        {
            wounds.wounded.active = true;
        }

        else if (numberOfWounds >= wounds.defeated.range[0]  && numberOfWounds <= wounds.defeated.range[1])
        {
            wounds.defeated.active = true;
        }
    }

    effectIsActive(effect)
    {
        if (this.hasThresholds && [this.wounds.unwounded.effect.id, this.wounds.wounded.effect.id, this.wounds.defeated.effect.id].includes(effect.id))
        {
            if (this.wounds.unwounded.active && this.wounds.unwounded.effect.id == effect.id)
            {
                return true;
            }
            else if (this.wounds.wounded.active && this.wounds.wounded.effect.id == effect.id)
            {
                return true;
            }
            else if (this.wounds.defeated.active && this.wounds.defeated.effect.id == effect.id)
            {
                return true;
            }
            return false;
        }
        else return true;
    }

    _addModelProperties() {
        this.wounds.unwounded.effect.relative = this.parent.effects;
        this.wounds.wounded.effect.relative = this.parent.effects;
    }

}

