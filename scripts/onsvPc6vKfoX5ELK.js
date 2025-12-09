if (args.action == "aim" && args.test.succeeded && this.actor.system.isStaggered)
{
  this.actor.removeCondition("staggered");
  this.script.message("Removed Staggered")
}