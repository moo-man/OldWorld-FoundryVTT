if (args.opposed.unopposed && args.attackerTest.skill == "shooting" && args.opposed.success)
{
  args.defender.addCondition("broken");
  this.actor.useItem(this.item);
  this.effect.update({disabled: true})
}