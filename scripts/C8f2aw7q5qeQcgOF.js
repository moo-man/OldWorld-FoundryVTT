if (!this.item.system.treated && !this.actor.hasCondition("critical"))
{
  this.actor.addCondition("critical");
  this.script.notification("Added Critically Injured!")
}