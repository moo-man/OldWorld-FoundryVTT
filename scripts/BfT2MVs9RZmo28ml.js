if (!this.item.system.treated)
{
  if (args.type == "effect" && args.options.action == "delete" && ["blinded", "critical"].includes(args.document.conditionId))
  {
    this.script.notification("Cannot remove")
    return false;
  }
}

if (args.type == "effect" && args.options.action == "delete" && ["staggered"].includes(args.document.conditionId))
{
  this.script.notification("Cannot remove")
  return false;
}