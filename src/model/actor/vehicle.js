import OldWorldTables from "../../system/tables";
import { BaseActorModel } from "./base";

let fields = foundry.data.fields;

class VehicleActorReference extends DocumentReferenceModel {
    static defineSchema()
    {
        let schema = super.defineSchema();
        schema.number = new fields.NumberField({min: 1, initial: 1});
        return schema;
    }
}

class OccupantsDataModel extends DocumentReferenceListModel {
    static listSchema = VehicleActorReference;
    static defineSchema()
    {
        let schema = super.defineSchema();
        schema.max = new fields.NumberField({min: 0, initial: 0})
        schema.value = new fields.NumberField({min: 0, initial: 0})
        return schema;
    }
}

class AnimalsDataModel extends DocumentReferenceListModel {
    static listSchema = VehicleActorReference;
    static defineSchema()
    {
        let schema = super.defineSchema();
        schema.required = new fields.NumberField({min : 0, initial: 0})
        schema.value = new fields.NumberField({min: 0, initial: 0})
        return schema;
    }
}

class CrewDataModel extends DocumentReferenceListModel {
    static listSchema = VehicleActorReference;
    static defineSchema()
    {
        let schema = super.defineSchema();
        schema.required = new fields.NumberField({min : 0, initial: 0})
        schema.value = new fields.NumberField({min: 0, initial: 0})
        return schema;
    }
}


/**
 * Represents actors that have characteristics and skills
 * Encompasses player characters and NPCs
 */
export class VehicleActorModel extends BaseActorModel 
{
    static defineSchema() 
    {
        let schema = super.defineSchema();

        schema.type = new fields.StringField({initial: "land"})

        schema.animals = new fields.EmbeddedDataField(AnimalsDataModel);
        schema.occupants = new fields.EmbeddedDataField(OccupantsDataModel);

        schema.driver = new fields.EmbeddedDataField(DocumentReferenceModel);

        schema.crew = new fields.SchemaField({
            sail: new fields.EmbeddedDataField(CrewDataModel),
            row: new fields.EmbeddedDataField(CrewDataModel)
        }) 
        
        schema.resilience = new fields.SchemaField({
            value : new fields.NumberField(),
            modifier : new fields.NumberField({initial: 0}),
            armoured : new fields.BooleanField()
        });

        schema.speed = new fields.SchemaField({
            land: new fields.SchemaField({
                value : new fields.StringField({initial : "normal"}),
                modifier : new fields.NumberField({initial : 0, min: 0})
            }),
            row: new fields.SchemaField({
                value : new fields.StringField({initial : "normal"}),
                modifier : new fields.NumberField({initial : 0, min: 0})
            }),
            sail: new fields.SchemaField({
                value : new fields.StringField({initial : "normal"}),
                modifier : new fields.NumberField({initial : 0, min: 0})
            })
        });

        schema.faults = new fields.SchemaField({
            value : new fields.NumberField({min: 0, initial: 0}),
            max : new fields.NumberField({min: 0, initial: 0})
        })
        return schema;
    }

    async _preUpdate(data, options, user)
    {
        await super._preUpdate(data, options, user);

    }

    async _onUpdate(data, options, user)
    {
        await super._onUpdate(data, options, user);
    }
    
    computeBase() 
    {
        super.computeBase();
    }
    computeDerived()
    {
        super.computeDerived();
        this.animals.total = this.animals.value + this.animals.list.reduce((total, i) => total += i.number || 0, 0);
        this.occupants.total = this.occupants.value + this.occupants.list.reduce((total, i) => total += i.number || 0, 0);
        this.crew.row.total = this.crew.row.value + this.crew.row.list.reduce((total, i) => total += i.number || 0, 0);
        this.crew.sail.total = this.crew.sail.value + this.crew.sail.list.reduce((total, i) => total += i.number || 0, 0);
    
    }

        
    _addModelProperties()
    {
        super._addModelProperties();
    }

    async useItem(item, context = {}, options) {
        if (typeof item == "string") {
            if (item.includes(".")) {
                item = await fromUuid(item);
            }
            else {
                item = actor.items.get(item);
            }
        }


        context.item = item;

        if (item.system.test?.self && item.system.test?.skill) {
            let actor = await this.chooseActor();
            if (item.system.isAttack)
            {
                return actor.setupAbilityTest(item, context, options);
            }
        
            context.appendTitle = ` - ${this.parent.name}`;
            context.vehicle = CONFIG.ChatMessage.documentClass.getSpeaker({actor: this.parent});
            context.vehicle.alias = this.parent.prototypeToken.name;
            actor.setupSkillTest(item.system.test.skill, context, options)
        }
        else {
            ItemUse.fromItem(item, this.parent, context);
        }
    }

    async chooseActor(list)
    {
        let actors = [];

        if (list)
        {
            actors = this[list].documents;
        }
        else
        {
            actors = this.occupants.documents.concat(this.crew.row.documents).concat(this.crew.sail.documents);
        }

        if (!actors || actors.length == 0)
        {
            ui.notifications.error("No Actors to choose from to roll Test");
        }

        return (await ItemDialog.create(actors, 1, {title : this.parent.name, text: "Choose Actor", useToken: true}))[0];
    }

    async chooseTargetActor()
    {
        let actors = [this.parent].concat(this.animals.documents).concat(this.occupants.documents).concat(this.crew.row.documents).concat(this.crew.sail.documents);
        return (await ItemDialog.create(actors, 1, {title : this.parent.name, text: "Choose Actor", useToken: true, defaultValue: this.parent.id}))[0];
    }

    async applyDamage(damage, {ignoreArmour, opposed, item, test})
    {
        let resilience = this.resilience.value;
        let text = [];
        let args = {actor: this.parent, attacker: test?.actor, resilience, ignoreArmour, opposed, test, text}
        await Promise.all(this.parent.runScripts("preTakeDamage", args));
        await Promise.all(test?.actor.runScripts("preApplyDamage", args) || []);

        if (ignoreArmour)
        {
            damage++;
            text.push({name: "Ignore Armour", description: "+1 Damage"})
        }

        let message = ""

        await this.parent.applyEffect({effects: test?.damageEffects || []});
        if (damage > resilience)
        {
            message = `TOW.Chat.SuffersFault`
            args.result = "fault";
            OldWorldTables.rollTable("fault");
            this.parent.update({"system.faults.value" : this.faults.value + 1})
        }
        else
        {
            message = `TOW.Chat.NoEffect`
            args.result = "none";
        }

        await Promise.all(this.parent.runScripts("takeDamage", args));
        await Promise.all(test?.actor.runScripts("applyDamage", args) || []);

        if (opposed)
        {
            let owner = warhammer.utility.getActiveDocumentOwner(opposed.parent)
            if (owner.id == game.user.id)
            {
                opposed.updateAppliedDamage(message)
            }
            else 
            {
                owner.query("updateAppliedDamage", {id : opposed.parent.id, message})
            }
        }
        else 
        {
            let name = (this.parent.getActiveTokens()[0] ?? this.prototypeToken).name
            ChatMessage.implementation.create({
                content: game.i18n.format(message, {name}),
                speaker : {
                    alias: name
                },
                flavor : game.i18n.localize("TOW.Chat.AppliedDamage") + ` (${damage})`
            })
        }
    }
}

