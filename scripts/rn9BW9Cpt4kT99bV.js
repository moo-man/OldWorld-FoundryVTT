let eye = Math.ceil(CONFIG.Dice.randomUniform() * 2) == 2 ? "Right" : "Left"
this.effect.updateSource({name : this.effect.setSpecifier(eye)})

this.script.message(`Lost ${eye} Eye`);