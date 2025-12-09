let hand = Math.ceil(CONFIG.Dice.randomUniform() * 2) == 2 ? "Right" : "Left"

this.item.updateSource({name : this.item.setSpecifier(hand)});
this.effect.updateSource({name : this.effect.setSpecifier(hand)});

let message = `<p><strong>${hand} Hand</strong>: Drop whatever is held.</p>`

let test = await this.actor.setupSkillTest("endurance");

if (test.failed)
{
  message += "<p><strong>Failed Endurance Test</strong>: Lost a finger</p>"  
}

this.script.message(message);