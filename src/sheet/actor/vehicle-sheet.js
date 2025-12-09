import BaseOldWorldActorSheet from "./base";

export default class ActorSheetOldWorldVehicle extends BaseOldWorldActorSheet
{
    static DEFAULT_OPTIONS = {
        classes: ["vehicle"],
        actions: {  
          setDriver: this._onSetDriver,
          rollTest: this._onRollTest
        },
        position : {
          height: 700
        },
        window : {
          resizable : true
        },
      }

      static PARTS = {
        header: { scrollable: [""], template: 'systems/whtow/templates/actor/vehicle/vehicle-header.hbs' },
        tabs: { scrollable: [""], template: 'templates/generic/tab-navigation.hbs' },
        main: { scrollable: [""], classes: ["main"], template: 'systems/whtow/templates/actor/vehicle/vehicle-main.hbs' },
        trappings: { scrollable: [""], template: 'systems/whtow/templates/actor/vehicle/vehicle-trappings.hbs' },
        notes: { scrollable: [""], template: 'systems/whtow/templates/actor/vehicle/vehicle-notes.hbs' },
      }

      static TABS = {
        main: {
          id: "main",
          group: "primary",
          label: "TOW.Sheet.Tab.Main"
        },
        trappings: {
          id: "trappings",
          group: "primary",
          label: "TOW.Sheet.Tab.Trappings"
        },
        notes: {
          id: "notes",
          group: "primary",
          label: "TOW.Sheet.Tab.Notes"
        }
      }
      
      async _prepareContext(options)
      {
        let context = await super._prepareContext(options);
        context.quantities = {};

        return context;
      }

      async _onDropActor(data, ev)
      {
        if (ev.target.closest(".droppable"))
        {
          let actor = await Actor.implementation.fromDropData(data)
          let list = this._getList(ev);
          if (["npc", "character"].includes(actor?.type) && list)
          {
            if (actor.pack)
            {
              return ui.notifications.error("Must be an imported Actor")
            }
            this.document.update(list.add(actor));
          }
        }
      }

      async _onDrop(ev)
      {
        let data = JSON.parse(ev.dataTransfer.getData("text/plain"));
        if (data.fromList && ev.target.closest(".droppable"))
        {
          let list = foundry.utils.getProperty(this.document, data.fromList)
          if (list)
          {
            await this.document.update(list.removeId(data.uuid));
            return this._onDropActor(data, ev);
          }
        }
        else 
        {
          return super._onDrop(ev);
        }
      }

      async _onDragStart(ev)
      {
        ev.dataTransfer.setData("text/plain", JSON.stringify({ fromList: ev.target.closest(".sheet-list").dataset.path, uuid: ev.target.dataset.uuid }));
      }

      static async _onSetDriver(ev, target)
      {
        let actor = await this._getDocumentAsync(ev, target);
        this.document.update(this.document.system.driver.set(actor));
      }

      static async _onRollTest(ev, target)
      {
        let actor = await this._getDocumentAsync(ev, target);
        let skill = await game.oldworld.utility.skillDialog({title: "Vehicle Test"});

        if (actor && skill)
        {
          actor.setupSkillTest(skill, {vehicle: this.document.uuid, appendTitle: ` - ${this.document.name}`});
        }
      }
}