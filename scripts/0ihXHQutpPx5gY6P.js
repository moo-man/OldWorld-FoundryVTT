await this.actor.addCondition("defenceless", this.effect);
await this.actor.addCondition("critical", this.effect);

this.actor.applyEffect({effects : this.item.effects.contents[1]});