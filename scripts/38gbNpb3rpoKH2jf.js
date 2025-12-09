let successes = this.effect.getFlag("whtow", "successes")
let message;
if (successes == 0)
{
  message = "The target’s injury is beyond Shallya’s mercy, at least for now. You may attempt this prayer again after the next dawn."
}
else if (successes == 1)
{
 message = "The target’s injury is improved. They recover after the next downtime without a Rest and Recovery Endeavour." 
}
else if (successes == 2)
{
  message = "The target’s injury is much improved and is healed after a single night’s rest."
}
else if (successes >= 3)
{
  message = "The target is instantly healed of one Wound of your choice."
  let wound = await ItemDialog.create(this.actor.itemTypes.wound, 1, {text: "Choose Wound to heal", title: this.effect.name})
  if (wound[0])
  {
    message += ` (${wound[0].name})`;
    wound[0].delete();
  }
}

this.script.message(message);