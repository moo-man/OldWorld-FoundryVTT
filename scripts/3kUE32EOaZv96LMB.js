let test = await this.actor.setupSkillTest("endurance", {appendTitle : ` - ${this.item.name}`})

if (test.failed)
{
  this.actor.addCondition("blinded");
}