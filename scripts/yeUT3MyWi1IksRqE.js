this.script.message(`<p><strong>${this.effect.sourceActor.name}</strong> rolls on the Wound Table!</p>`)
args.abort = true;
this.effect.sourceActor.system.addWound({fromTest: args.test, opposed: args.opposed, diceModifier: args.diceModifier})