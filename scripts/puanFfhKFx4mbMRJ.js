let wounds = this.actor.itemTypes.wound.filter(i => !i.system.treated && i.system.healing == 2)

if (!wounds.length)
{
  return ui.notifications.error("No eligible Wounds to heal!");
}
else 
{
  let choice = await ItemDialog.create(wounds, 1, {title : this.effect.name, text: "Choose Wound to treat"})
  if (choice[0])
  {
    choice[0].update({"system.treated" : true});
    this.script.message(`Treated <strong>${choice[0].name}</strong>`)
    this.effect.update({disabled : true});
  }
}