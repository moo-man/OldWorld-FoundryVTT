if (this.actor.hasCondition("staggered"))
{
  this.script.notification("Remove Staggered");
  this.actor.removeCondition("staggered");
}
if (this.actor.hasCondition("prone"))
{
  this.script.notification("Remove Prone");
  this.actor.removeCondition("prone");
}