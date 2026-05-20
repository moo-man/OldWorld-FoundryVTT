if (args.attackerTest?.context.flags.moonfire && args.defender)
{
  if (args.opposed.outcome == "success")
  { 
    args.defender.addCondition("ablaze");
  }
  this.effect.update({disabled : true});
}