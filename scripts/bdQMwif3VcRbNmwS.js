if (args.type == "effect" && args.options.action == "create" && ["broken"].some(i => args.document.statuses.has(i)))
{
  if (this.actor.system.fate.current)
  {
    if (await foundry.applications.api.Dialog.confirm({window: {title: this.effect.name}, content: "Spend Fate to avoid Broken?"}))
    { 
      this.actor.spend("system.fate.current");
      this.script.message("<p>Spent Fate to avoid Broken</p>");
      return false;
    }
  }
  else 
  {
    this.script.notification("No Fate left!")
  }

   if (await foundry.applications.api.Dialog.confirm({window: {title: this.effect.name}, content: "Use Honour Bound to avoid Broken?"}))
    { 
      this.script.message("<p>Used <strong>Honour Bound</strong> to avoid Broken</p>");
      return false;
    }
}