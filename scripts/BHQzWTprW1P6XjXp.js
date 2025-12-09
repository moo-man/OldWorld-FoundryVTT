if (!this.item.system.treated)
{
  if (args.type == "effect" && args.options.action == "delete" && ["defenceless", "critical"].includes(args.document.conditionId))
  {
    this.script.notification("Cannot remove")
    return false;
  }
}