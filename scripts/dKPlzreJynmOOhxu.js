let test = await this.actor.setupSkillTest("endurance", {appendTitle : ` - ${this.effect.name}`, skipTargets: true});

if (!test.successfullyOpposes(this.effect.getFlag("whtow", "successes")))
{
  this.actor.addCondition("staggered")
}
else 
{
  return false;
}