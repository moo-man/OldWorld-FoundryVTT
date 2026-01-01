if (args.type == "effect" && args.options.action == "delete" && ["burdened", "drained"].includes(args.document.conditionId))
{
  this.script.notification(`Cannot remove ${args.document.name} until healed.`)
  return false;
}

if (!this.item.system.treated)
{
  if (args.type == "effect" && args.options.action == "delete" && ["critical"].includes(args.document.conditionId))
  {
    this.script.notification(`Cannot remove ${args.document.name} until treated.`)
    return false;
  }
}