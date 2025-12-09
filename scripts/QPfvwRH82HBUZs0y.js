if (args.type == "effect" && args.options.action == "create" && args.document.statuses.has("broken"))
{
  this.script.notification("Immune to Broken");
  return false;
}