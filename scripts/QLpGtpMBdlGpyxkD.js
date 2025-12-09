if (this.actor.itemTypes.wound.length == 0)
{
  return this.script.notification("No Wounds!");
}

let choice = await ItemDialog.create(this.actor.itemTypes.wound, 1, {title: this.effect.name, text: "Choose Wound to heal"});

if (choice[0])
{
  this.script.message(`<p>Healed <strong>${choice[0].name}</strong></p>`);

  choice[0].delete();

  this.item.update({name: this.item.setSpecifier(Number(this.item.specifier) - 3)});
}