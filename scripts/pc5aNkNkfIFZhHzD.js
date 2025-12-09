if (args.opposed.outcome == "failure" && args.attackerTest.item?.system.isMelee)
{
  args.attacker.addCondition("burdened");
  this.script.message("Inflicted Burdened!")
}