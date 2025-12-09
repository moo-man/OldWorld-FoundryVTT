if (await foundry.applications.api.Dialog.confirm({window: {title: `${this.actor.name} - ${this.effect.name}` }, content : "<p>Gain Staggered to Regenerate a Wound?"}))
{
  this.actor.itemTypes.wound[0].delete();
  if (!this.actor.system.isStaggered)
  { 
    this.actor.addCondition("staggered");
  }
}