let damage = 4 + this.effect.sourceTest.context.potency
if (this.actor.system.resilience.armoured)
{
  damage++;
}
this.actor.applyDamage(damage, {item : this.effect.sourceItem, test : this.effect.sourceTest})