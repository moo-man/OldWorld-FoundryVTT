let fields = foundry.data.fields;
/**
 * Abstract class that interfaces with the Actor class
 */
export class BaseActorModel extends BaseWarhammerActorModel 
{

    static defineSchema() 
    {
        let schema = {};
        schema.description = new fields.SchemaField({
            public : new fields.HTMLField(),
            gm : new fields.HTMLField()
        });
        schema.opposed = new fields.ForeignDocumentField(foundry.documents.BaseChatMessage, {nullable: true, initial : null})
        return schema;
    }

    get opposedTest()
    {
        return this.opposed?.system.test;
    }

    registerOpposed(test)
    {
        this.parent.update({"system.opposed" : test.message});
    }

    clearOpposed()
    {
        this.parent.update({"system.opposed" : null});
    }

    applyDamage()
    {
        
    }
    
    async _preCreate(data, options, user) 
    {
        super._preCreate(data, options, user)
        if (!data.prototypeToken)
        {
            this.parent.updateSource({
                "prototypeToken.name" : data.name,
                "prototypeToken.displayName" : CONST.TOKEN_DISPLAY_MODES.HOVER,
                "prototypeToken.displayBars" : CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER
            });
        }
    }
}