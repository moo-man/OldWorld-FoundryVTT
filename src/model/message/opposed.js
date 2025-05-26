export class OldWorldOpposedMessageModel extends WarhammerTestMessageModel 
{

    static defineSchema() 
    {
        let fields = foundry.data.fields;
        let schema = {};
        schema.attackerMessageId = new fields.StringField();
        schema.defenderMessageId = new fields.StringField();
        schema.defender = new fields.TypedObjectField(new fields.SchemaField({
            token : new fields.StringField(),
            actor : new fields.StringField(),
            alias : new fields.StringField(),
            scene : new fields.StringField()
        }));
        schema.unopposed = new fields.BooleanField();
        schema.result = new fields.SchemaField({
            computed : new fields.BooleanField({initial : false})
        })
        return schema;
    }

    static async createFromTest(test, targetToken)
    {
        let chatData = {
            attacker : test.token,
            defender : targetToken
        }
        
        let content = await foundry.applications.handlebars.renderTemplate("systems/whtow/templates/chat/opposed.hbs", chatData);
        return ChatMessage.create({type : "opposed", content, system : {
            attackerMessageId : test.message.id,
            defenderMessageId : null,
            defender : {
                token : targetToken.id,
                actor : targetToken.actor?.id,
                alias : targetToken.name,
                scene : targetToken.parent?.id
            },
        }})
    }

    static getChatData(target)
    {

    }
}