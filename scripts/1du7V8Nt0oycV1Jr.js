if (this.actor.system.resilience.armoured)
{
  this.actor.applyDamage(4, {item : this.effect.sourceItem})
}
else
{
  this.actor.applyDamage(3, {item : this.effect.sourceItem})
}