
export default class BaseOldWorldItemSheet extends WarhammerItemSheetV2 {

    static DEFAULT_OPTIONS = {
      classes: ["whtow"],
      window: {
      },
      actions: {
        toggleSummary: this._toggleSummary,
        createItem: this._onCreateItem,
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
  
    async _prepareContext(options) {
      let context = await super._prepareContext(options);
      return context;
    }
  
  
    _addEventListeners() {
      super._addEventListeners();
  
    }
  
  
    async _handleEnrichment() {
      let enrichment = {}
      enrichment["system.description.public"] = await TextEditor.enrichHTML(this.document.system.description.public, { async: true, secrets: this.document.isOwner, relativeTo: this.document })
      enrichment["system.description.gm"] = await TextEditor.enrichHTML(this.document.system.description.gm, { async: true, secrets: this.document.isOwner, relativeTo: this.document })
  
      return expandObject(enrichment)
    }
  }
  