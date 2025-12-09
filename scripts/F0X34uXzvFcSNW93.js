this.effect.updateSource(this.effect.convertToPassive());

let arm = Math.ceil(CONFIG.Dice.randomUniform() * 2) == 2 ? "Right" : "Left"
this.effect.updateSource({name : this.effect.setSpecifier(arm)})

this.script.message(`Lost ${arm} Arm`);