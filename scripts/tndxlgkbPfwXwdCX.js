let teeth = Math.ceil(CONFIG.Dice.randomUniform() * 10)
this.effect.updateSource({name : this.effect.setSpecifier(teeth)})

this.script.message(`Lost ${teeth} teeth`);