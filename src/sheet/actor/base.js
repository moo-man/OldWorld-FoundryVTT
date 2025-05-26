
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
      toggleSummary: this._toggleSummary,
      createItem: this._onCreateItem,
    },
    defaultTab: "main"
  }

  async _prepareContext(options) {
    let context = await super._prepareContext(options);
    return context;
  }


  _addEventListeners() {
    super._addEventListeners();

  }


  async _handleEnrichment() {
    let enrichment = {}
    enrichment["system.description.gm"] = await TextEditor.enrichHTML(this.actor.system.description.gm, { async: true, secrets: this.actor.isOwner, relativeTo: this.actor })
    enrichment["system.description.public"] = await TextEditor.enrichHTML(this.actor.system.description.public, { async: true, secrets: this.actor.isOwner, relativeTo: this.actor })

    return expandObject(enrichment)
  }

  _getContextMenuOptions()
  { 
    let getParent = this._getParent.bind(this);
    return [
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

}
