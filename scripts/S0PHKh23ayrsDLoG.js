let test = await this.actor.setupSkillTest("endurance", {appendTitle : ` - ${this.item.name}`})

if (test.result.successes == 0)
{
  this.actor.system.addWound();
}
else if (test.result.successes < 2)
{
  if (this.actor.system.hasThresholds)
  {
    this.script.message("Gains 2 Wounds");
    this.actor.createEmbeddedDocuments("Item", [{type : "wound", name : "Wound"},{type : "wound", name : "Wound"}])
  }
  else
  { 
    this.actor.system.addWound({diceModifier: 1});
  }
}