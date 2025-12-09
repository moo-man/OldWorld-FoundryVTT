this.actor.system.giveGround({flavor : this.effect.name});

let test = await this.actor.setupSkillTest("willpower", {appendTitle : ` - ${this.effect.name}`})
let potency = this.effect.sourceTest?.context?.potency || 1

if (test.result.successes < potency)
{ 
  this.actor.addCondition("broken");
}