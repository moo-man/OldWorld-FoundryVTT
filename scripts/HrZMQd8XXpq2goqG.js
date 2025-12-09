if (args.test.item?.system.isMagical && this.effect.disabled)
{
  this.effect.update({"disabled": false});
  this.script.notification("Recharged");
}