
export default class BaseOldWorldActorSheet extends WarhammerActorSheetV2 {

  static DEFAULT_OPTIONS = {
    classes: ["whtow"],
    window: {
      controls: [
        {
          icon: 'fa-solid fa-gear',
          label: "Actor Settings",
          action: "configureActor"
        }
      ]
    },
    actions: {
      removeOpposed : this._onRemoveOpposed,
      useItem : this._onUseItem,
      useMountItem : this._onUseMountItem,
      toggleSummary : this._onToggleSummary
    },
    defaultTab: "main"
  }

  get title()
  {
    return this.actor.name;
  }

  async _prepareContext(options) {
    let context = await super._prepareContext(options);
    context.conditions = this.formatConditions();
    return context;
  }
  

  formatConditions()
  {
      let conditions = foundry.utils.deepClone(game.oldworld.config.conditions);
      for(let key in conditions)
      {
        conditions[key].existing = this.document.hasCondition(key)
      }
      return conditions;
  }

  _addEventListeners()
  {
      super._addEventListeners();

      this.element.querySelectorAll(".rollable").forEach(element => {
          element.addEventListener("mouseenter", ev => {
          let img = ev.target.matches("img") ? ev.target : ev.target.querySelector("img") ;
          if (img)
          {
              this._icon = img.src;
              img.src = "systems/whtow/assets/dice/d10.svg";
          }
          })
          element.addEventListener("mouseleave", ev => {
          let img = ev.target.matches("img") ? ev.target : ev.target.querySelector("img") ;
          if (img)
          {
              img.src = this._icon;
          }
          })
      });
  }

  async _handleEnrichment() {
    let enrichment = {}
    enrichment["system.description.gm"] = await foundry.applications.ux.TextEditor.enrichHTML(this.actor.system.description.gm, { async: true, secrets: this.actor.isOwner, relativeTo: this.actor })
    enrichment["system.description.public"] = await foundry.applications.ux.TextEditor.enrichHTML(this.actor.system.description.public, { async: true, secrets: this.actor.isOwner, relativeTo: this.actor })

    return foundry.utils.expandObject(enrichment)
  }

  _getContextMenuOptions()
  { 
    let getParent = this._getParent.bind(this);
    return [
      {
        name: "Clear Progress",
        icon: '<i class="fa-solid fa-broom-wide"></i>',
        condition: li => {
          let uuid = li.dataset.uuid || getParent(li, "[data-uuid]").dataset.uuid
          if (uuid)
          {
            let parsed = foundry.utils.parseUuid(uuid);
            if (parsed.type == "Item")
            {
              let item = this.actor.items.get(parsed.id);
              if (item?.type == "spell" && item.system.progress)
              return true;
            }
            else
            {
              return false;
            }
          }
          else return false
        },
        callback: async li => {
          let uuid = li.dataset.uuid || getParent(li, "[data-uuid]").dataset.uuid;
          let parsed = foundry.utils.parseUuid(uuid);
          this.actor.update({[`system.magic.casting.-=${parsed.id}`] : null});
        }
      },
      {
        name: "Edit",
        icon: '<i class="fas fa-edit"></i>',
        condition: li => !!li.dataset.uuid || getParent(li, "[data-uuid]"),
        callback: async li => {
          let uuid = li.dataset.uuid || getParent(li, "[data-uuid]").dataset.uuid;
          const document = await fromUuid(uuid);
          document.sheet.render(true);
        }
      },
      {
        name: "Remove",
        icon: '<i class="fas fa-times"></i>',
        condition: li => {
          let uuid = li.dataset.uuid || getParent(li, "[data-uuid]").dataset.uuid
          if (uuid)
          {
            let parsed = foundry.utils.parseUuid(uuid);
            if (parsed.type == "ActiveEffect")
            {
              return parsed.primaryId == this.document.id; // If an effect's parent is not this document, don't show the delete option
            }
            else if (parsed.type)
            {
              return true;
            }
            return false;
          }
          else return false;
        },
        callback: async li => 
        {
          let uuid = li.dataset.uuid || getParent(li, "[data-uuid]").dataset.uuid;
          const document = await fromUuid(uuid);
          document.delete();
        }
      }
    ];
  }

  static _onRemoveOpposed(ev, target)
  {
    this.actor.system.clearOpposed();
  }

  static _onUseItem(ev, target)
  {
    this.actor.useItem(this._getUUID(ev));
  }

  static _onUseMountItem(ev, target)
  {
    this.actor.useMountItem(this._getUUID(ev));
  }

  static async _onToggleSummary(ev, target)
  {
    let document = this._getDocument(ev);
    let summaryData = await document.system.summaryData();
    this._toggleDropdown(ev, summaryData.description);
  }

}
