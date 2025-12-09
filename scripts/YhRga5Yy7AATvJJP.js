if (args.type == "item" && args.document.type == "wound" && args.options.action == "create")
{
  if (await foundry.applications.api.Dialog.confirm({window: {title : this.effect.name}, content: `<p>Invoke the <strong>Lady's Blessing</strong> to negate <strong>${args.document.name}</strong>?</p>`}))
  {
    this.script.message(`Negated <strong>${args.document.name}</strong>`)
    this.effect.delete();
    return false;
  }
}