

export class XPMessageModel extends WarhammerMessageModel {
  
  static get actions() {
    return foundry.utils.mergeObject(super.actions, {
      receive : this._onReceive,
    });
  }

  
  static defineSchema() 
  {
      let schema = {};

      // amount of XP
      schema.amount = new foundry.data.fields.NumberField({});

      // What XP reward is for
      schema.reason = new foundry.data.fields.StringField()

      // Who has received the XP already
      schema.receivedBy = new foundry.data.fields.ArrayField(new foundry.data.fields.StringField);

      return schema;
  }

  static handleXPCommand(amount, reason)
  {
     
    if (isNaN(amount))
      return ui.notifications.error("TOW.Error.Experience", {localize : true})


    this.createXPMessage(amount, reason);
  }
  

  static createXPMessage(amount, reason)
  {

      renderTemplate("systems/whtow/templates/chat/xp.hbs", { amount, reason}).then(html => {
      ChatMessage.create({ 
        type : "xp", 
        content: html, 
        speaker : {
          alias  : game.i18n.localize("TOW.Chat.Experience"),
        },
        system : {
          amount, reason
        }});
    })
  }

  updateReceived(actor)
  {
    this.parent.update({"system.receivedBy" : this.system.receivedBy.concat(actor.id)});
  }


  static async _onReceive(ev, target)
  {

    if (game.user.isGM) 
    {
      let actors = warhammer.utility.targetsWithFallback()
      if (!actors.length)
      {
        return ui.notifications.warn("TOW.Error.ActorsXP", {localize : true})
      }

      actors.forEach(actor => 
      {
        if (!this.receivedBy.includes(actor.id)) 
        {
          this.receivedBy.push(actor.id); // Add locally to handle fast clicking or no GM 
          actor.system.awardXP(this.amount, this.reason, this.parent.id)
        }
        else
        {
          ui.notifications.notify(`${actor.name} already received this reward.`)
        }
      })

      if (canvas.scene)
      { 
        game.canvas.tokens.setTargets([])
      }
    }
    else // Not GM User
    {
      if (!game.user.character)
      {
        return ui.notifications.warn("TOW.Error.CharAssigned", {localize : true})
      }
      if (this.receivedBy.includes(game.user.character.id))
      {
        return ui.notifications.notify(`${game.user.character.name} already received this reward.`)
      }

      this.receivedBy.push(game.user.character.id); // Add locally to handle fast clicking or no GM 
      game.user.character.system.awardXP(this.amount, this.reason, this.parent.id)
    }
  }

}