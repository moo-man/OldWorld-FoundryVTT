if (args.type == "effect" && args.document.statuses.has("dead") && args.options.action == "create")
{
  this.actor.useItem(this.item);
}