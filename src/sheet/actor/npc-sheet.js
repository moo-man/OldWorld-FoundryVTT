import MountConfig from "../../apps/mount-config";
import StandardOldWorldActorSheet from "./standard-sheet";

export default class ActorSheetOldWorldNPC extends StandardOldWorldActorSheet
{
    _editing = false;
    static DEFAULT_OPTIONS = {
        classes: ["npc"],
        actions: {
          toggleEdit : this._onToggleEdit,
          configureMount: this._onConfigureMount
        },
        position : {
          height: 700
        },
        window : {
          resizable : true,
          controls : [
            {
              icon : 'fa-solid fa-horse',
              label : "Configure Mount",
              action : "configureMount"
            }
          ]
        },
      }

      static PARTS = {
        header: { scrollable: [""], template: 'systems/whtow/templates/actor/npc/npc-header.hbs' },
        tabs: { scrollable: [""], template: 'templates/generic/tab-navigation.hbs' },
        main: { scrollable: [""], classes: ["main"], template: 'systems/whtow/templates/actor/npc/npc-main.hbs' },
        magic: { scrollable: [""], template: 'systems/whtow/templates/actor/tabs/actor-magic.hbs' },
        religion: { scrollable: [""], template: 'systems/whtow/templates/actor/tabs/actor-religion.hbs' },
        effects: { scrollable: [""], template: 'systems/whtow/templates/actor/tabs/actor-effects.hbs' },
        notes: { scrollable: [""], template: 'systems/whtow/templates/actor/npc/npc-notes.hbs' },
      }

      static TABS = {
        main: {
          id: "main",
          group: "primary",
          label: "TOW.Sheet.Tab.Main",
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
        effects: {
          id: "effects",
          group: "primary",
          label: "TOW.Sheet.Tab.Effects",
        },
        notes: {
          id: "notes",
          group: "primary",
          label: "TOW.Sheet.Tab.Notes",
        }
      }
      
      async _prepareContext(options)
      {
        let context = await super._prepareContext(options);
        context.alphaSkills = Object.keys(context.system.skills).sort((a, b) => a > b ? 1 : -1);
        context.abilities = this.document.itemTypes.ability.concat(this.document.itemTypes.talent).filter(i => !i.system.isAttack);
        context.attacks = this.document.itemTypes.ability.filter(i => i.system.isAttack)
        context.trappings = this.document.items.filter(i => i.system.isPhysical);
        context.editing = this._editing;
        if (["brute", "monstrosity"].includes(this.document.system.type))
        {
          context.woundBreakdown = this._formatWoundBreakdown();
        }
        return context;
      }

      _formatWoundBreakdown()
      {
        let wounds = this.document.system.wounds;
        let breakdown = {
          unwounded : {
            range : "",
            active: wounds.unwounded.active,
            description : wounds.unwounded.effect.document?.name || wounds.unwounded.description
          },
          wounded : {
            range : "",
            active: wounds.wounded.active,
            description : wounds.wounded.effect.document?.name || wounds.wounded.description
          },
          defeated : {
            range : game.i18n.format("TOW.Sheet.XWounds", {wounds: wounds.defeated.threshold}),
            active: wounds.defeated.active,
            description : wounds.defeated.effect.document?.name || game.i18n.localize("TOW.Sheet.Defeated")
          }
        }

        if (wounds.unwounded.range[0] != wounds.unwounded.range[1])
        {
          breakdown.unwounded.range = game.i18n.format("TOW.Sheet.XYWounds", {x : wounds.unwounded.range[0], y : wounds.unwounded.range[1]})
        }
        else 
        {
          breakdown.unwounded.range = game.i18n.format("TOW.Sheet.XWounds", {wounds : wounds.unwounded.range[0]})
        }

        if (wounds.wounded.range[0] != wounds.wounded.range[1])
        {
          breakdown.wounded.range = game.i18n.format("TOW.Sheet.XYWounds", {x : wounds.wounded.range[0], y : wounds.wounded.range[1]})
        }
        else 
        {
          breakdown.wounded.range = game.i18n.format("TOW.Sheet.XWounds", {wounds : wounds.wounded.range[0]})
        }



        return breakdown;
      }

      
    async _handleEnrichment() {
      let enrichment = await super._handleEnrichment();
      enrichment.abilities = {};

      for(let ability of this.document.itemTypes.ability.concat(this.document.itemTypes.talent))
      {
        let html = await foundry.applications.ux.TextEditor.enrichHTML(ability.system.description.public, { async: true, secrets: ability.isOwner, relativeTo: ability })
        if (game.user.isGM)
        {
          html += await foundry.applications.ux.TextEditor.enrichHTML(ability.system.description.gm, { async: true, secrets: ability.isOwner, relativeTo: ability })
        }
        enrichment.abilities[ability.id] = html;
      }

      return foundry.utils.expandObject(enrichment)
    }

    static async  _onToggleEdit()
    {
      this._editing = !this._editing;
      this.element.classList.toggle("editing")
      this.render({force: true});
    }

    static async _onConfigureMount()
    {
      new MountConfig(this.document).render({force: true});
    }

}