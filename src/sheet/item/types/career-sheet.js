import BaseOldWorldItemSheet from "../base-item"

export default class CareerSheet extends BaseOldWorldItemSheet {

    static type = "career"

    static DEFAULT_OPTIONS = {
      classes: [this.type],
    }  

    static PARTS = {
        header : {scrollable: [""], template : 'systems/whtow/templates/item/item-header.hbs', classes: ["sheet-header"] },
        tabs: { scrollable: [""], template: 'templates/generic/tab-navigation.hbs' },
        description: { scrollable: [""], template: 'systems/whtow/templates/item/item-description.hbs' },
        details: { scrollable: [""], template: `systems/whtow/templates/item/types/${this.type}.hbs` },
        effects: { scrollable: [""], template: 'systems/whtow/templates/item/item-effects.hbs' },
      }

      async _prepareContext(options) {
        let context = await super._prepareContext(options);
        context.originHTML = `<p>${(await Promise.all(this.document.system.origins.documents)).map(origin => `<a class="document" data-action="editEmbedded" data-uuid="${origin.uuid}" data-id="${origin.id}">${origin.name}</a>`)}</p>`
        return context;
      }

      async _onDropItem(data, ev)
      {
        let item = await Item.implementation.fromDropData(data);

        if (item.type == "origin")
        {
          this.document.update(this.document.system.origins.add(item));
        }
        if (item.type == "talent")
        {
          this.document.update(this.document.system.talent.set(item));
        }
      }
    
    
  }
  