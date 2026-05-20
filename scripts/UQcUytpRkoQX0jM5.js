let test = await this.actor.setupSkillTest("athletics", {appendTitle : ` - ${this.effect.name}`})
let potency = this.effect.sourceTest?.context?.potency || 1

if (test.result.successes < potency)
{ 
  this.actor.addCondition("prone");
  this.actor.system.addWound();
}