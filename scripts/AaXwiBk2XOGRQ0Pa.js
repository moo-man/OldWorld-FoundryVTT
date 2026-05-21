if (this.actor.system.characteristics.s.value < 4 && !this.actor.hasCondition("burdened"))
{
  await this.actor.addCondition("burdened");
  this.script.notification("Adding Burdened")
}