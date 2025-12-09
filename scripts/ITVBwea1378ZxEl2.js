if (!this.effect.getFlag("whtow", "ablazeAdded"))
{ 
  args.actor.addCondition("ablaze");
  
  // Item-appplied effects act weird when trying to update
  this.actor.effects.get(this.effect.id).setFlag("whtow", "ablazeAdded", true);
}