if (this.actor.system.characteristics.s.value < 3 && !this.actor.hasCondition("burdened"))
{
  await this.actor.addCondition("burdened");
  this.script.notification("Adding Burdened")
}