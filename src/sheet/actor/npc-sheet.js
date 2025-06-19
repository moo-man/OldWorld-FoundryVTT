import StandardOldWorldActorSheet from "./standard-sheet";

export default class ActorSheetOldWorldNPCV2 extends StandardOldWorldActorSheet
{
    static DEFAULT_OPTIONS = {
        classes: ["npc"],
        actions: {

        },
        window : {
          resizable : true
        },
      }

      static PARTS = {

      }

      static TABS = {

      }
      
      async _prepareContext(options)
      {
        let context = await super._prepareContext(options);
        return context;
      }
}