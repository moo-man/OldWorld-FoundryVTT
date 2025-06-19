import BaseOldWorldActorSheet from "./base";

export default class StandardOldWorldActorSheet extends BaseOldWorldActorSheet
{

  static DEFAULT_OPTIONS = {
    actions : {
      toggleCondition: this._onToggleCondition
    },
  }

  static TABS = {
    main: {
      id: "main",
      group: "primary",
      label: "Main",
    },
    combat: {
      id: "combat",
      group: "primary",
      label: "Combat",
    },
    magic: {
      id: "magic",
      group: "primary",
      label: "Magic",
    },
    religion: {
      id: "religion",
      group: "primary",
      label: "Religion",
    },
    effects: {
      id: "effects",
      group: "primary",
      label: "Effects",
    },
    trappings: {
      id: "trappings",
      group: "primary",
      label: "Trappings",
    },
    notes: {
      id: "notes",
      group: "primary",
      label: "Notes",
    }
  }

  _prepareTabs(options) {
    let tabs = super._prepareTabs(options);

    if (!this.actor.itemTypes.spell.length) {
      delete tabs.magic;
    }

    if (!this.actor.itemTypes.blessing.length) {
      delete tabs.religion;
    }

    return tabs;
  }

  static _onToggleCondition(ev, target)
  {
    if (this.actor.hasCondition(target.dataset.condition))
    {
      this.actor.removeCondition(target.dataset.condition)
    }
    else 
    {
      this.actor.addCondition(target.dataset.condition)
    }
  }

}
