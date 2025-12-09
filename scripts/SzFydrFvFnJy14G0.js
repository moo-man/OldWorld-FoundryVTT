if (!args.actor.system.itemTypes.ability.find(i => i.name == "Fearsome"))
{ 
  args.actor.addCondition("broken");
  this.script.message("Added Broken")
}