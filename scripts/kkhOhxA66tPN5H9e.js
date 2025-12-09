let staggered =  this.actor.hasCondition("staggered");

if (staggered)
{
  staggered.delete();
  this.script.notification("Removed Staggered");
}