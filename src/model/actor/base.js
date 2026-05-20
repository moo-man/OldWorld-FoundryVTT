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

    registerOpposed(message)
    {
        this.parent.update({"system.opposed" : message});
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

    async _onUpdate(data, options, user)
    {
        // User might be GM instead of player, so only run for actual document owner
        if (game.user.id == warhammer.utility.getActiveDocumentOwner(this.parent)?.id && data.system?.opposed && data.system.opposed != this.opposed)
        {
            let message = game.messages.get(data.system.opposed);
            this.parent.runScripts("targeted", {test: message?.system?.test})
        }
    }
}