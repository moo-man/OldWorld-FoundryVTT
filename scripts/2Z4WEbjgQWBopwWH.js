let hand = Math.ceil(CONFIG.Dice.randomUniform() * 2) == 2 ? "Right" : "Left"

this.script.message(`Drop whatever is in the ${hand} Hand`);