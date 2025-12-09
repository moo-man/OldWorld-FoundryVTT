if (!this.item.system.treated)
{
  if (args.type == "effect" && args.options.action == "create" && ["staggered"].includes(args.document.conditionId))
  {
    this.script.message("Added a Wound instead of Staggered")
    this.actor.system.addWound();
    return false;
  }
}