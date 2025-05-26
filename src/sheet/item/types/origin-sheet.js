import BaseOldWorldItemSheet from "../base-item"

export default class OriginSheet extends BaseOldWorldItemSheet {

    static type = "origin"

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

      async _onDropRollTable(data, ev)
      {
        let table = await RollTable.implementation.fromDropData(data);

        if (ev.target.closest(".careers"))
        {
          this.document.update(this.document.system.careers.set(table));

        }
        else if (ev.target.closest(".talents"))
        {
          this.document.update(this.document.system.talents.table.set(table));
        }
      }

      async _onDropItem(data, ev)
      {
        let item = await Item.implementation.fromDropData(data);

        if (item.type == "talent")
        {
          if (ev.target.closest(".replacement"))
          {
            this.document.update(this.document.system.talents.replacements.add(item));
          }
          else 
          {
            this.document.update(this.document.system.talents.gain.add(item));

          }
        }
      }
  }
  