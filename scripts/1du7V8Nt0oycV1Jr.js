if (this.actor.system.resilience.armoured)
{
  this.actor.system.applyDamage(4, {item : this.effect.sourceItem})
}
else
{
  this.actor.system.applyDamage(3, {item : this.effect.sourceItem})
}