import { CharacteristicsModel } from "./components/characteristics";
import { SkillsModel } from "./components/skills";
import { StandardActorModel } from "./standard";
let fields = foundry.data.fields;

export class CharacterModel extends StandardActorModel 
{
    static singletonItemPaths = {
        "origin" : "origin",
        "career" : "career",
        "blessing" : "blessed",
        "corruption" : "corruption"
    };

    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.characteristics = new fields.EmbeddedDataField(CharacteristicsModel);
        schema.skills = new fields.EmbeddedDataField(SkillsModel);
        schema.origin = new fields.EmbeddedDataField(SingletonItemModel);
        schema.career = new fields.EmbeddedDataField(SingletonItemModel);
        schema.coins = new fields.SchemaField({
            brass : new fields.NumberField({initial: 0, min: 0}),
            silver : new fields.NumberField({initial: 0, min: 0}),
            gold : new fields.NumberField({initial: 0, min: 0})
        })
        schema.xp = new fields.SchemaField({
            total : new fields.NumberField({initial: 0, min: 0}),
            offsets : ListModel.createListModel(new fields.SchemaField({
                description : new fields.StringField(),
                amount : new fields.NumberField()
            })),
            log : ListModel.createListModel(new fields.SchemaField({
                reason : new fields.StringField(),
                amount : new fields.NumberField(),
                total : new fields.NumberField()
            }))
        })
        schema.fate = new fields.SchemaField({
            current : new fields.NumberField({initial : 0}),
            max : new fields.NumberField({initial : 0})
        })
        schema.details = new fields.SchemaField({
            age : new fields.NumberField(),
            eyes : new fields.StringField(),
            hair : new fields.StringField(),
            height : new fields.StringField(),
            weight : new fields.StringField(),
        });
        return schema;
    }

    async _preCreate(data, options, user) 
    {
        await super._preCreate(data, options, user);
        if (!data.prototypeToken)
        {
            this.parent.updateSource({
                "prototypeToken.sight" : {enabled : true},
                "prototypeToken.actorLink" : true,
                "prototypeToken.disposition" : CONST.TOKEN_DISPOSITIONS.FRIENDLY
            });
        }
    }

    async _preUpdate(data, options, user)
    {
        let newXPTotal = foundry.utils.getProperty(options.changed, "system.xp.total")
        let xpChanged = newXPTotal - this.xp.total;
        if (!options.skipXPCheck && newXPTotal)
        {
            let reason = (await ValueDialog.create({title : "XP", text : "Reason for XP Change?"})) || "Unspecified Reason";

            if (reason)
            {
                foundry.utils.mergeObject(data, this.xp.log.add({reason, amount : xpChanged, total : newXPTotal}))
            }
        }
    }

    async _onUpdate(data, options, user) {
        await super._onUpdate(data, options, user);

        // If XP received from message award, add
        if (options.fromMessage && game.users.activeGM.id == game.user.id)
        {
          game.messages.get(options.fromMessage)?.updateReceived(this.parent);
        }
    }

    _addModelProperties()
    {
        this.origin.relative = this.parent.items;
        this.career.relative = this.parent.items;
    }

    computeDerived()
    {
        super.computeDerived();
        this.computeXP();
    }

    computeXP()
    {
        let offsets = this.xp.offsets.list.reduce((amt, offset) => amt + offset.amount, 0);
        let spent = offsets;

        // Talent Costs
        spent += this.parent.itemTypes.talent.reduce((xp, talent) => xp + talent.system.cost, 0)

        // Characteristic Costs
        for(let c of Object.values(this.characteristics))
        {
            if (c.favoured)
            {
                spent += Array.fromRange(c.value).slice(c.base).reduce((sum, num) => sum + num, 0);
            }
            else 
            {
                spent += Array.fromRange(c.value + 1).slice(c.base + 1).reduce((sum, num) => sum + num, 0);
            }
        }

        this.xp.spent = spent;
        this.xp.available = this.xp.total - spent;
    }

    addXPOffset(amount, description)
    {
        return this.parent.update(this.xp.offsets.add({amount, description}));
    }

    awardXP(amount, reason, message)
    {
        let newTotal = this.xp.total + amount;
        return this.parent.update(foundry.utils.mergeObject({system : {xp : {total : newTotal}}}, this.xp.log.add({amount, reason, total : newTotal})), {skipXPCheck : true, fromMessage : message})
    }
}

