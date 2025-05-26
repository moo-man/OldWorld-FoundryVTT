import { StandardActorModel } from "./standard";
let fields = foundry.data.fields;

export class CharacterModel extends StandardActorModel 
{
    static singletonItemPaths = {
        "origin" : "origin",
        "career" : "career"  
    };

    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.origin = new fields.EmbeddedDataField(SingletonItemModel);
        schema.career = new fields.EmbeddedDataField(SingletonItemModel);
        schema.coins = new fields.SchemaField({
            brass : new fields.NumberField(),
            silver : new fields.NumberField(),
            gold : new fields.NumberField()
        })
        schema.xp = new fields.SchemaField({
            value : new fields.NumberField({initial: 0, min: 0})
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

    computeBase()
    {
        super.computeBase();
        this.characteristics.compute();
        this.skills.compute();
    }


    computeDerived()
    {
        super.computeDerived();
    }

    _addModelProperties()
    {
        this.origin.relative = this.parent.items;
        this.career.relative = this.parent.items;
    }
}

