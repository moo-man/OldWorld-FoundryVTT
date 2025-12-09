import ModifierConfig from "../../apps/modifier-config";

export default class BaseOldWorldItemSheet extends WarhammerItemSheetV2 {

  static DEFAULT_OPTIONS = {
    classes: ["whtow"],
    window: {
      controls: [          {
        icon : 'fa-solid fa-comment',
        label : "Post to Chat",
        action : "post"
      }]
    },
    actions: {
      configureModifiers: this._onConfigureModifiers,
      toggleCondition: this._onToggleCondition,
      post: this._onPostToChat

    },
    defaultTab: "description"
  }

  static TABS = {
    description: {
      id: "description",
      group: "primary",
      label: "TOW.Sheet.Tab.Description",
    },
    details: {
      id: "details",
      group: "primary",
      label: "TOW.Sheet.Tab.Details",
    },
    effects: {
      id: "effects",
      group: "primary",
      label: "TOW.Sheet.Tab.Effects",
    }
  }

  get title()
  {
    return this.item.name;
  }

  async _prepareContext(options) {
    let context = await super._prepareContext(options);
    return context;
  }

  async _prepareContext(options) {
    let context = await super._prepareContext(options);
    context.conditions = this.formatConditions();
    return context;
  }


  formatConditions() {
    let conditions = foundry.utils.deepClone(game.oldworld.config.conditions);
    for (let key in conditions) {
      conditions[key].existing = this.document.hasCondition(key)
    }
    return conditions;
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
        name: "Duplicate",
        icon: '<i class="fa-solid fa-copy"></i>',
        condition: li => !!li.dataset.uuid || getParent(li, "[data-uuid]"),
        callback: async li => 
        {
            let uuid = li.dataset.uuid || getParent(li, "[data-uuid]").dataset.uuid;
            const document = await fromUuid(uuid);
            this.item.createEmbeddedDocuments("ActiveEffect", [document.toObject()]);
        }
      },
      {
        name: "Remove",
        icon: '<i class="fas fa-times"></i>',
        condition: li => !!li.dataset.uuid || getParent(li, "[data-uuid]"),
        callback: async li => 
        {
          let uuid = li.dataset.uuid || getParent(li, "[data-uuid]").dataset.uuid;
          const document = await fromUuid(uuid);
          document.delete();
        }
      }
    ];
  }

  _addEventListeners() {
    super._addEventListeners();
  }


  async _handleEnrichment() {
    let enrichment = {}
    enrichment["system.description.public"] = await foundry.applications.ux.TextEditor.enrichHTML(this.document.system.description.public, { async: true, secrets: this.document.isOwner, relativeTo: this.document })
    enrichment["system.description.gm"] = await foundry.applications.ux.TextEditor.enrichHTML(this.document.system.description.gm, { async: true, secrets: this.document.isOwner, relativeTo: this.document })

    return foundry.utils.expandObject(enrichment)
  }

  static _onConfigureModifiers(ev, target) {
    new ModifierConfig(this.document).render({ force: true, path : "system.modifiers" });
  }

  static _onToggleCondition(ev, target) {
    let key = target.dataset.condition;
    if (this.document.hasCondition(key))
      this.document.removeCondition(key)
    else
      this.document.addCondition(key)
  }

  static _onPostToChat(ev, target)
  {
    this.document.post();
  }
}
