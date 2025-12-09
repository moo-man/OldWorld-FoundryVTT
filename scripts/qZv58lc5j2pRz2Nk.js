if (args.type == "effect" && args.options.action == "delete" && ["staggered"].includes(args.document.conditionId))
{
  this.script.notification("Cannot remove")
  return false;
}