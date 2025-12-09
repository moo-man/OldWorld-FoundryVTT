let test = await this.actor.setupSkillTest("endurance", {appendTitle : ` - ${this.effect.name}`})

if (test.result.successes < 2)
{
  if (this.actor.hasCondition("drained"))
  {
    this.actor.addCondition("defenceless")
  }
  else 
  {
    this.actor.addCondition("drained");
  }
}