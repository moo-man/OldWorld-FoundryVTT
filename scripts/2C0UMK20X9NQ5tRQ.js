if (args.test.casting && args.test.context.flags.wyrdstone)
{
  args.test.result.miscasts += 2;
  args.test.result.successes += 2;
  this.script.message("<strong>Wyrdstone Consumed</strong>: 2 Success and Miscasts added!");
  this.effect.update({disabled: true})
}