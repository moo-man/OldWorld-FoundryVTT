if (args.options.action == "create" && args.document.type == "wound" && this.actor.itemTypes.wound.length >= 4)
{
    this.actor.useItem(this.item, {rollMode: "gmroll"});
}