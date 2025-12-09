if (args.ability?.name == "Raking Claws")
{
  args.abort = true;
  this.script.notification("Wounded!")
}
return false;