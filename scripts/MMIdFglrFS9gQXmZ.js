if (this.actor.system.type == "minion")
{
  this.actor.addCondition("dead");
}
else 
{
  this.actor.system.addWound();
}