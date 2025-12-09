if (!this.item.system.treated)
{
  await this.actor.maintainCondition("deafened", this.effect);
}