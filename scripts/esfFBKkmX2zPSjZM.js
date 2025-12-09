let blessed = this.actor.system.blessed.document;
if (!blessed)
{
  let blessings = await warhammer.utility.findAllItems("blessing", null, true);
  blessed = (await ItemDialog.create(blessings, 1, {indexed: true, title: this.effect.name, text : "Choose a God's Favour"}))[0]
}

if (blessed)
{
  this.actor.createEmbeddedDocuments("Item", [blessed.toObject()]);
}