if (args.type == "item" && args.document.type == "wound"  && args.options.action == "create")
{
  this.actor.applyEffect({effects: [this.item.effects.contents[1]]})
}