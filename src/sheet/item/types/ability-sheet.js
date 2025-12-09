import ModifierConfig from "../../../apps/modifier-config";
import BaseOldWorldItemSheet from "../base-item"

export default class AbilitySheet extends BaseOldWorldItemSheet {

    static type = "ability"

    static DEFAULT_OPTIONS = {
      classes: [this.type],
      actions: {
        configureModifiers: this._onConfigureModifiers
      }
    }  

    static PARTS = {
        header : {scrollable: [""], template : 'systems/whtow/templates/item/item-header.hbs', classes: ["sheet-header"] },
        tabs: { scrollable: [""], template: 'templates/generic/tab-navigation.hbs' },
        description: { scrollable: [""], template: 'systems/whtow/templates/item/item-description.hbs' },
        details: { scrollable: [""], template: `systems/whtow/templates/item/types/${this.type}.hbs` },
        effects: { scrollable: [""], template: 'systems/whtow/templates/item/item-effects.hbs' },
      }

      static _onConfigureModifiers(ev, target) {
        new ModifierConfig(this.document).render({ force: true, path : "system.attack.modifiers" });
      }
    
  }
  