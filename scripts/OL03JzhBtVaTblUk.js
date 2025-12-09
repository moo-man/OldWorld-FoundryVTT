if (this.actor.system.isArmoured)
{
  this.actor.system.resilience.value++;
}
else 
{
  this.actor.system.resilience.value += 2;
}