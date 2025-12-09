if (!this.actor.hasCondition("burdened") && this.actor.itemTypes.weapon.filter(i => i.system.isMelee && i.system.grip == "2H").length)
{
  this.script.notification("Added Burdened");
  this.actor.addCondition("burdened");
}