import BaseOldWorldItemSheet from "../base-item"

export default class BlessingSheet extends BaseOldWorldItemSheet {

    static type = "blessing"

    static DEFAULT_OPTIONS = {
      classes: [this.type],
      defaultTab : "details",
      position : {
        height: 500
      }
    }  

    static TABS = {
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

    static PARTS = {
        header : {scrollable: [""], template : 'systems/whtow/templates/item/item-header.hbs', classes: ["sheet-header"] },
        tabs: { scrollable: [""], template: 'templates/generic/tab-navigation.hbs' },
        description: { scrollable: [""], template: 'systems/whtow/templates/item/item-description.hbs' },
        details: { scrollable: [""], template: `systems/whtow/templates/item/types/${this.type}.hbs` },
        effects: { scrollable: [""], template: 'systems/whtow/templates/item/item-effects.hbs' },
      }

      async _handleEnrichment() {
        let enrichment = {}
        enrichment["system.favour"] = await TextEditor.enrichHTML(this.document.system.favour, { async: true, secrets: this.document.isOwner, relativeTo: this.document })
        enrichment["system.miracles"] = await TextEditor.enrichHTML(this.document.system.miracles, { async: true, secrets: this.document.isOwner, relativeTo: this.document })
        enrichment["system.prayers"] = await Promise.all(this.document.system.prayers.list.map(i => TextEditor.enrichHTML(i.description)))
        return expandObject(enrichment)
      }
  }
  