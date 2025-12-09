let loweredResilience = this.actor.system.resilience.value -this.effect.sourceTest.context.potency;

this.actor.system.resilience.value = Math.max(this.actor.system.characteristics.t.value, loweredResilience)