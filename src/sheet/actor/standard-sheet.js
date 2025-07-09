import OldWorldTables from "../../system/tables";
import BaseOldWorldActorSheet from "./base";

export default class StandardOldWorldActorSheet extends BaseOldWorldActorSheet
{

  static DEFAULT_OPTIONS = {
    actions : {
      toggleCondition: this._onToggleCondition,
      disposeMiscast : this._onDisposeMiscast,
      rollMiscast : this._onRollMiscast,
      useBlessing : this._onUseBlessing,
      regainMiracle : this._onRegainMiracle
    },
  }
  
  _prepareTabs(options) {
    let tabs = super._prepareTabs(options);

    if (this.actor.system.magic.level == 0 && this.actor.itemTypes.spell.length == 0) 
    {
      delete tabs.magic;
    }

    if (!this.actor.itemTypes.blessing.length) {
      delete tabs.religion;
    }

    return tabs;
  }

  async _prepareContext(options)
  { 
    let context = await super._prepareContext(options);    
    context.characteristics = this._formatCharacteristics()

    context.miscasts = new Array(this.actor.system.magic.level).fill(null).map((_, index) => { return {active : this.actor.system.magic.miscasts > index}});
    if (this.actor.system.magic.miscasts > this.actor.system.magic.level)
    {
      context.miscasts = context.miscasts.concat(new Array(this.actor.system.magic.miscasts - this.actor.system.magic.level).fill(null).map((_, index) => { return {active : true, exceeds : true}}));
    }
    // context.miscasts = context.miscasts.concat(new Array(this.actor.system.magic.miscasts));
    return context;
  }

  static _onToggleCondition(ev, target)
  {
    if (this.actor.hasCondition(target.dataset.condition))
    {
      this.actor.removeCondition(target.dataset.condition)
    }
    else 
    {
      this.actor.addCondition(target.dataset.condition)
    }
  }

  static _onDisposeMiscast(ev, target)
  {
    if (this.actor.inCombat)
    {
      this.actor.update({"system.magic.miscasts" : this.actor.system.magic.miscasts - 1})
      ChatMessage.create({content : game.i18n.localize("TOW.Chat.DisposingMiscastsCombat"), flavor : game.i18n.localize("TOW.Chat.DisposingMiscasts"), speaker : {alias : (this.actor.getActiveTokens()[0] || this.actor.prototypeToken).name}})
    }
    else 
    {
      this.actor.update({"system.magic.miscasts" : 0})
      ChatMessage.create({content : game.i18n.format("TOW.Chat.DisposingMiscastsNonCombat", {miscasts : this.actor.system.magic.miscasts}), flavor : game.i18n.localize("TOW.Chat.DisposingMiscasts"), speaker : {alias : (this.actor.getActiveTokens()[0] || this.actor.prototypeToken).name}})
    }
  }
  static _onRollMiscast(ev, target)
  {
    OldWorldTables.rollTable("miscast", `${this.actor.system.magic.miscasts}d10`)
    this.actor.update({"system.magic.miscasts" : 0})
  }

  static _onUseBlessing(ev, target)
  {
    let type = target.dataset.type;
    let index = target.dataset.index;

    this.actor.useBlessing(type, {index})
  }

  static _onRegainMiracle(ev, target)
  {
    this.actor.system.blessed.document?.update({"system.miracles.used" : false})
  }

}
