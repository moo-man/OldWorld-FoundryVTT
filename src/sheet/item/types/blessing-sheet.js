import BaseOldWorldItemSheet from "../base-item"

export default class BlessingSheet extends BaseOldWorldItemSheet {

  static type = "blessing"

  static DEFAULT_OPTIONS = {
    classes: [this.type],
    defaultTab: "details",
    position: {
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
    header: { scrollable: [""], template: 'systems/whtow/templates/item/item-header.hbs', classes: ["sheet-header"] },
    tabs: { scrollable: [""], template: 'templates/generic/tab-navigation.hbs' },
    description: { scrollable: [""], template: 'systems/whtow/templates/item/item-description.hbs' },
    details: { scrollable: [""], template: `systems/whtow/templates/item/types/${this.type}.hbs` },
    effects: { scrollable: [""], template: 'systems/whtow/templates/item/item-effects.hbs' },
  }

  async _handleEnrichment() {
    let enrichment = {}
    enrichment["system.favour.description"] = await TextEditor.enrichHTML(this.document.system.favour.description, { async: true, secrets: this.document.isOwner, relativeTo: this.document })
    enrichment["system.miracles.description"] = await TextEditor.enrichHTML(this.document.system.miracles.description, { async: true, secrets: this.document.isOwner, relativeTo: this.document })
    enrichment["system.prayers"] = await Promise.all(this.document.system.prayers.list.map(i => TextEditor.enrichHTML(i.description)))
    return expandObject(enrichment)
  }

  async _onRender(options) {
    await super._onRender(options);

    this.element.querySelectorAll("[data-action='addBlessingEffect']").forEach(e => e.addEventListener("change", (ev) => (this.constructor._addBlessingEffect.bind(this))(ev, e)));
    this.element.querySelectorAll("[data-action='assignBlessingEffect']").forEach(e => e.addEventListener("change", (ev) => (this.constructor._assignBlessingEffect.bind(this))(ev, e)));
  }

  static _addBlessingEffect(ev, target) {
    let id = target.value;
    let type = target.dataset.type;
    let index = Number(target.dataset.index);
    let blessingObj = !isNaN(index) ? this.document.system[type].list[index] : this.document.system[type];
    if (id) {
      if (!blessingObj.effects.list.find(i => i.id == id)) {
        if (type == "prayers") {
          this.document.update({ [`system.prayers.list.${index}.effects.list`]: this.document.system.prayers.list[index].effects.list.concat({ id }) });
        }
        else {
          this.document.update(blessingObj.effects.add(this.document.effects.get(id)));
        }
      }
    }
  }

  static _assignBlessingEffect(ev, target) {
    let id = target.value;
    let type = target.dataset.type;
    let index = Number(target.dataset.index);
    let blessingObj = !isNaN(index) ? this.document.system[type].list[index] : this.document.system[type];
    if (id) {
      if (type == "prayers") {
        let prayers = this.document.system.prayers.toJSON();
        prayers.list[index].effect.id = id;
        prayers.list[index].effect.uuid = this.document.effects.get(id).uuid;
        this.document.update({ "system.prayers": prayers });
      }
      else {
        this.document.update(blessingObj.effect.set(this.document.effects.get(id)));
      }
    }
  }

}
