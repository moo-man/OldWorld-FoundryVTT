this.effect.updateSource(this.effect.convertToPassive());

let leg = Math.ceil(CONFIG.Dice.randomUniform() * 2) == 2 ? "Right" : "Left"
this.effect.updateSource({name : this.effect.setSpecifier(leg)})

this.script.message(`Lost ${leg} Leg`);