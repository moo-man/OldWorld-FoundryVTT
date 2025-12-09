if (args.opposed.success && args.attackerTest.item?.name == "Rough Shove" && args.defender?.system.isStaggered)
{
  this.actor.useItem(this.item);
}