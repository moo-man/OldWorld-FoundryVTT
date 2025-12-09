if (args.actor.system.isStandard &&  args.actor.system.type != "monstrosity")
{
  if (args.test.context.charging)
  {
    args.actor.addCondition("prone");
  }
}