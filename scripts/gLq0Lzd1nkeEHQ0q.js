let wounds = this.actor.itemTypes.wound;
let choice;

if (this.effect.sourceTest.context.potency > wounds.length)
{
  let healable = wounds.filter(i => i.system.healing < 4);
  if (healable.length > 0)
  { 
    choice = (await ItemDialog.create(healable, 1, {text: "Choose Wound to heal, or select none to treat Wounds instead.", title: this.effect.name}))?.[0]
    if (choice)
    {
        this.script.message(`<p>Healed <strong>${choice.name}</strong>`)
        choice.delete()
        return;
    }
  }
}

if (!choice)
{
  let treatable = wounds.filter(i => !i.system.treated)
  if (treatable.length > 0)
  {
    choice = (await ItemDialog.create(treatable, 1, {text: "Choose Wound to treat", title: this.effect.name}))?.[0]
  }
  else 
  {
    this.script.notification("No Wounds to treat.");
  }
}

if (choice)
{
  choice.update({"system.treated" : true});
  this.script.message(`<p>Treated <strong>${choice.name}</strong>`)
}