if (!this.item.system.treated)
{
  if (args.type == "effect" && args.options.action == "delete" && ["critical", "defenceless"].includes(args.document.conditionId))
  {
    this.script.notification(`Cannot remove ${args.document.name} until treated.`)
    return false;
  }
}