if (this.actor.hasCondition("broken"))
{
  let test = await this.actor.setupSkillTest("willpower", {appendTitle : ` - ${this.effect.name}`});

  if (test.succeeded)
  {
    this.actor.removeCondition("broken");
  }
}