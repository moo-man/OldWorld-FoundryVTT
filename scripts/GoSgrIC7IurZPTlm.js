let potency = this.effect.sourceTest.context.potency || 1;

let roll = await new Roll(`${potency}d10`).roll();

roll.toMessage(this.script.getChatData())

this.script.message(`Ages ${roll.total} years!`);

this.actor.addCondition("drained");