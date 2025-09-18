import BaseOldWorldItemSheet from "../base-item"

export default class CorruptionSheet extends BaseOldWorldItemSheet {

  static type = "corruption"

  static DEFAULT_OPTIONS = {
    classes: [this.type],
    defaultTab: "details",
    position: {
      height: 500
    }
  }

  static PARTS = {
    header: { scrollable: [""], template: 'systems/whtow/templates/item/item-header.hbs', classes: ["sheet-header"] },
    tabs: { scrollable: [""], template: 'templates/generic/tab-navigation.hbs' },
    description: { scrollable: [""], template: 'systems/whtow/templates/item/item-description.hbs' },
    details: { scrollable: [""], template: `systems/whtow/templates/item/types/${this.type}.hbs` },
    effects: { scrollable: [""], template: 'systems/whtow/templates/item/item-effects.hbs' },
  }

  async _handleEnrichment() {
    let enrichment = await super._handleEnrichment();
    enrichment["system.vulnerable"] = await foundry.applications.ux.TextEditor.enrichHTML(this.document.system.vulnerable, { async: true, secrets: this.document.isOwner, relativeTo: this.document })
    enrichment["system.tarnished.description"] = await foundry.applications.ux.TextEditor.enrichHTML(this.document.system.tarnished.description, { async: true, secrets: this.document.isOwner, relativeTo: this.document })
    enrichment["system.tainted.description"] = await foundry.applications.ux.TextEditor.enrichHTML(this.document.system.tainted.description, { async: true, secrets: this.document.isOwner, relativeTo: this.document })
    enrichment["system.damned.description"] = await foundry.applications.ux.TextEditor.enrichHTML(this.document.system.damned.description, { async: true, secrets: this.document.isOwner, relativeTo: this.document })
    return foundry.utils.expandObject(enrichment)
  }

  async _onRender(options) {
    await super._onRender(options);

    this.element.querySelectorAll("[data-action='assignCorruptionEffect']").forEach(e => e.addEventListener("change", (ev) => (this.constructor._assignCorruptionEffect.bind(this))(ev, e)));
  }

  static _assignCorruptionEffect(ev, target) {
    let id = target.value;
    let type = target.dataset.type;
    let corruptionObj = this.document.system[type];
    if (id) 
    {
      this.document.update(corruptionObj.effect.set(this.document.effects.get(id)));
    }
  }

}
