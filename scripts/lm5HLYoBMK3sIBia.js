if (args.type == "effect" && args.document.statuses.has("broken") && args.options.action == "create")
{
  this.script.message("Broken! Loses the <strong>Lady's Blessing</strong>")
  this.effect.sourceItem.effects.contents[1].update({disabled: true})
  this.effect.delete();
}