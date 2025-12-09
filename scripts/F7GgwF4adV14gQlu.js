if (!this.actor.system.isStaggered && await foundry.applications.api.Dialog.confirm({window: {title: `${this.actor.name} - ${this.effect.name}` }, content : "<p>Gain Staggered to Regenerate a Wound?"}))
{
  this.actor.itemTypes.wound[0].delete();
  this.actor.addCondition("staggered");
}