import { AdvancementForm } from "../../apps/advancement";
import TestDialogV2 from "../../apps/test-dialog/test-dialog";
import StandardOldWorldActorSheet from "./standard-sheet";

export default class ActorSheetOldWorldCharacter extends StandardOldWorldActorSheet
{

    static DEFAULT_OPTIONS = {
        classes: ["character"],
        actions: {
          rollTest: this._onRollTest
        },
        window : {
          resizable : true,
        },
        position : {
          height: 900
        },
        actions : {
          advancement : this._onAdvancement,
          regainMiracle : this._onRegainMiracle,
          corruptionTest : this._onCorruptionTest,
          offerTemptation : this._onOfferTemptation
        },
        defaultTab : "main"
    }

      static PARTS = {
        header: { scrollable: [""], template: 'systems/whtow/templates/actor/character/character-header.hbs' },
        tabs: { scrollable: [""], template: 'templates/generic/tab-navigation.hbs' },
        main: { scrollable: [""], classes: ["main"], template: 'systems/whtow/templates/actor/character/character-main.hbs' },
        combat: { scrollable: [""], template: 'systems/whtow/templates/actor/tabs/actor-combat.hbs' },
        magic: { scrollable: [""], template: 'systems/whtow/templates/actor/tabs/actor-magic.hbs' },
        religion: { scrollable: [""], template: 'systems/whtow/templates/actor/tabs/actor-religion.hbs' },
        corruption: { scrollable: [""], template: 'systems/whtow/templates/actor/tabs/actor-corruption.hbs' },
        effects: { scrollable: [""], template: 'systems/whtow/templates/actor/tabs/actor-effects.hbs' },
        trappings: { scrollable: [""], template: 'systems/whtow/templates/actor/tabs/actor-trappings.hbs' },
        notes: { scrollable: [""], template: 'systems/whtow/templates/actor/character/character-notes.hbs' },
      }

      static TABS = {
        main: {
          id: "main",
          group: "primary",
          label: "TOW.Sheet.Tab.Main",
        },
        combat: {
          id: "combat",
          group: "primary",
          label: "TOW.Sheet.Tab.Combat",
        },
        magic: {
          id: "magic",
          group: "primary",
          label: "TOW.Sheet.Tab.Magic",
        },
        religion: {
          id: "religion",
          group: "primary",
          label: "TOW.Sheet.Tab.Religion",
        },
        corruption: {
          id: "corruption",
          group: "primary",
          label: "TOW.Sheet.Tab.Corruption",
        },
        effects: {
          id: "effects",
          group: "primary",
          label: "TOW.Sheet.Tab.Effects",
        },
        trappings: {
          id: "trappings",
          group: "primary",
          label: "TOW.Sheet.Tab.Trappings",
        },
        notes: {
          id: "notes",
          group: "primary",
          label: "TOW.Sheet.Tab.Notes",
        }
      }


      
    _configureRenderParts(options) 
    {
        let parts = super._configureRenderParts(options);
        if (!game.user.isGM)
        {
            delete parts.corruption;
        }
        return parts;
    }

    _prepareTabs(options) {
      let tabs = super._prepareTabs(options);
  
      if (!game.user.isGM)
      {
          delete tabs.corruption;
      }
  
      return tabs;
    }
      
      async _prepareContext(options)
      { 
        let context = await super._prepareContext(options);    
        context.characteristics = this._formatCharacteristics()

        context.coins = {
          brass : new Array(10).fill(null).map((_, index) => { return {filled : this.actor.system.coins.brass > index}}),
          silver : new Array(10).fill(null).map((_, index) => { return {filled : this.actor.system.coins.silver > index}}),
          gold : new Array(10).fill(null).map((_, index) => { return {filled : this.actor.system.coins.gold > index}})
        }
        return context;
      }

      _formatCharacteristics()
      {
        let characteristics = foundry.utils.deepClone(this.actor.system.characteristics);
        for (let c in characteristics)
        { 
          characteristics[c].skills = {};
          for(let s in this.actor.system.skills)
          {
            if (this.actor.system.skills[s].characteristic == c)
            {
              characteristics[c].skills[s] = this._formatSkill(s)
            }
          }
        } 
        return characteristics;
          
      }

      _formatSkill(key)
      {
        let skill = foundry.utils.deepClone(this.actor.system.skills[key]);
        skill.pips = Array(8).fill(null).map((pip, index) => index < skill.value);
        return skill;
      }

      static _onAdvancement(ev, target)
      {
        new AdvancementForm(this.actor).render({force : true})
      }

      static async _onRegainMiracle(ev, target)
      {

        let confirm = await foundry.applications.api.Dialog.confirm({
          window : {title : "TOW.Dialog.RegainMiracleTitle"},
          content : game.i18n.localize("TOW.Dialog.RegainMiracle"),
        })

        if (confirm)
        {
          await this.actor.system.blessed.document?.update({"system.miracles.used" : false})
          this.actor.system.addXPOffset(4, game.i18n.localize("TOW.Sheet.PurchaseMiracleUse"))
        }
      }

      static async _onCorruptionTest(ev, target)
      {
        this.actor.system.corruption.promptCorruptionTest();
      }

      static async _onOfferTemptation(ev, target)
      {
        this.actor.system.corruption.offerTemptation();
      }
}