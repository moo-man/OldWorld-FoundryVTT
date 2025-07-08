import { OldWorldTest } from "../../system/tests/test";

export class OldWorldOpposedMessageModel extends WarhammerTestMessageModel 
{
    static get actions() {
        return foundry.utils.mergeObject(super.actions, {
            opposedResponse : this._onOpposedResponse,
            applyDamage : this._onApplyDamage
       })
    }

    get defenderToken()
    {
        return game.scenes.get(this.parent.system.defender.scene).tokens.get(this.parent.system.defender.token)
    }

    get attackerToken()
    {
        return this.attackerMessage.system.test.token
    }

    get defenderTest()
    {
        return this.defenderMessage.system.test;
    }

    get attackerTest()
    {
        return this.attackerMessage.system.test;
    }


    static defineSchema() 
    {
        let fields = foundry.data.fields;
        let schema = {};
        schema.attackerMessage = new fields.ForeignDocumentField(foundry.documents.BaseChatMessage)
        schema.defenderMessage = new fields.ForeignDocumentField(foundry.documents.BaseChatMessage)
        schema.defender = new fields.SchemaField({
            token : new fields.StringField(),
            actor : new fields.StringField(),
            alias : new fields.StringField(),
            scene : new fields.StringField()
        });
        schema.unopposed = new fields.BooleanField();
        schema.result = new fields.SchemaField({
            description : new fields.StringField(),
            outcome : new fields.StringField(),
            successes : new fields.NumberField(),
            success : new fields.BooleanField(),
            computed : new fields.BooleanField({initial : false}),
            damage : new fields.SchemaField({
                value : new fields.NumberField({nullable : true, initial: null}),
                applied : new fields.BooleanField(),
                message : new fields.StringField()
            }, {nullable : true})
        })
        return schema;
    }

    /**
     * Creates an opposed test from from 
     * 
     * @param {OldWorldTest} test Attacking Test
     * @param {token} targetToken Token targeted by the test
     * @returns 
     */
    static async createFromTest(test, targetToken)
    {
        let chatData = {
            attacker : test.token,
            defender : targetToken,
            responseOptions : this.getResponseOptions(targetToken.actor)
        }
        
        let content = await foundry.applications.handlebars.renderTemplate("systems/whtow/templates/chat/opposed.hbs", chatData);
        return ChatMessage.create({type : "opposed", content, system : {
            attackerMessage : test.message,
            defenderMessage : null,
            defender : {
                token : targetToken.id,
                actor : targetToken.actor?.id,
                alias : targetToken.name,
                scene : targetToken.parent?.id
            },
        }})
    }

    static getResponseOptions(actor)
    {
      if (!actor)
      {
        return [];
      }
      let options = [
        { id : "unopposed", tooltip : game.i18n.localize("TOW.Chat.Unopposed"), icon : "fa-arrow-down" },
        { id : "athletics", tooltip : game.i18n.localize("TOW.SkillName.Athletics"), icon : "fa-reply" },
      ]
  
      if (actor)
      {
        // Use first weapon equipped
        let weapons = actor.itemTypes.weapon.filter(i => i.system.isMelee && i.system.isEquipped);

        for(let weapon of weapons)
        {
          options.push({id : weapon.id, tooltip : `${game.i18n.localize("TOW.SkillName.Defence")} (${weapon.name})`, icon : "fa-shield"});
        }
      }
  
      return options;
    }

    async onRender(html)
    {
        // Remove response buttons if not owner of the defendering actor
        if (!this.defenderToken.actor.isOwner)
        {
            html.querySelector(".responses")?.remove();
        }
    }

    /**
     * Rerenders the opposed message
     * 
     * @param {Boolean} compute Whether to recompute the opposed result
     */
    async renderResult(compute=false)
    {
        if (compute && this.parent.system.result.computed)
        {
            await this.parent.update({"system.result" : this.attackerMessage.system.test.computeOpposedResult(this.defenderMessage?.system.test)})
        }
        let chatData = {
            attacker : this.attackerToken,
            defender : this.parent.system.defenderMessage?.system.test.token ?? this.defenderToken,
            result : this.parent.system.result
        }

        if (!this.parent.system.result.computed)
        {
            chatData.responseOptions = this.constructor.getResponseOptions(chatData.defender.actor);
        }
        
        let content = await foundry.applications.handlebars.renderTemplate("systems/whtow/templates/chat/opposed.hbs", chatData);

        this.parent.update({content})
    }

    /**
     * Set the provided test as the response to this opposed message, compute, and  render
     * 
     * @param {OldWorldTest} test Test registered as a response
     */
    async registerResponse(test)
    {
        let responseData = {
            defenderMessage : test.message, 
            defender: test.context.speaker, 
            result : this.attackerMessage.system.test.computeOpposedResult(test)
        }
        await this.parent.update({system : responseData})
        this.renderResult();
    }

    /**
     * Designate this opposed test as unopposed, then compute it as such
     */
    async setUnopposed()
    {
        let owner = warhammer.utility.getActiveDocumentOwner(this.parent)
        if (owner.id != game.user.id)
        {
            return owner.query("updateUnopposed", {id : this.parent.id})
        }

        let responseData = {
            result : this.attackerMessage.system.test.computeOpposedResult(),
            unopposed : true
        }
        await this.parent.update({system : responseData})
        this.renderResult();
    }

    async updateAppliedDamage(message) 
    {
        await this.parent.update({"system.result.damage" : {applied : true, message}})
        this.renderResult();
    }

    static async  _onOpposedResponse(ev, target)
    {
        let type = target.dataset.type;
        let actor = ChatMessage.getSpeakerActor(this.defender);

        switch(type)
        {
            case "unopposed":
                return this.setUnopposed()
            case "athletics":
                return actor.setupSkillTest(type)
            default: 
                return actor.setupWeaponTest(type)

        }
    }

    static async  _onApplyDamage(ev, target)
    {
        let actor = ChatMessage.getSpeakerActor(this.defender);
        actor.system.applyDamage(this.result.damage.value, {opposed : this, item : this.attackerTest.item})
    }
}