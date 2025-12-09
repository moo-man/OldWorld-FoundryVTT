if (args.test.context.reload)
{
  let weapon = await fromUuid(args.test.context.reload)
  if (weapon.system.reload.current + args.test.result.successes >= weapon.system.reload.value)
  this.actor.useItem(this.item);
}