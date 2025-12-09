if (!args.extraWoundAdded && args.actor.system.type == "monstrosity" && args.test?.item?.system.isMelee)
{
  args.actor.system.addWound();
  this.script.message("Extra Wound Added!")
}