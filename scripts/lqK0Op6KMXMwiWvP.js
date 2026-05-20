let test = await this.actor.setupSkillTest("awareness", {appendTitle : ` - ${this.effect.name}`, skipTargets: true});

let successes = test.result.successes;

let diceModifier = 2;

if (successes >= 3)
{
  return false;
}

diceModifier -= successes;

this.actor.system.addWound({diceModifier})