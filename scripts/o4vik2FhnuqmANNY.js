if (args.options.action == "create" && args.document.type == "wound" && this.actor.itemTypes.wound.length >= 2)
{
    this.actor.useItem(this.actor.items.getName(this.effect.name), {rollMode: "gmroll"});
}