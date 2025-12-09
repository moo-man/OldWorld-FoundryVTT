if (args.weapon?.name == "Raking Claws")
{
  args.abort = true;
  this.script.notification("Wounded!")
}
return false;