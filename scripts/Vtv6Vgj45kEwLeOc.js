if (args.action == "recover")
{
  if (this.actor.itemTypes.wound[0])
  {
    this.actor.itemTypes.wound[0].delete();
    this.script.message("Healed a Wound");
  }
}