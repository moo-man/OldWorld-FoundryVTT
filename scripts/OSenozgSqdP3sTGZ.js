if (args.type == "effect" && args.options.action == "create" && args.document.statuses.has("staggered"))
{
  if (await foundry.applications.api.Dialog.confirm({window: {title: this.effect.name}, content: "<p>Gain a Wound instead of Staggered?</p>"}))
  {
    this.actor.system.rollWound();
    return false;
  } 
}