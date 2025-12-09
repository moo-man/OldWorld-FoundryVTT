let test = await args.actor.setupSkillTest("willpower", {appendTitle : ` - ${this.effect.name}`, skipTargets: true});

if (test.failed)
{  
  args.actor.addCondition("broken")
}