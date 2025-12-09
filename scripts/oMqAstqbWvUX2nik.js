if (args.type == "effect" && args.options.action == "create" && args.document.statuses.has("prone") && !this.actor.statuses.has("burdened"))
{
  if (await foundry.applications.api.Dialog.confirm({window: {title: this.effect.name}, content : "<p>Gain Burdened instead of Prone?</p>"}))
  {
    this.actor.addCondition("burdened")
    return false;
  }
}