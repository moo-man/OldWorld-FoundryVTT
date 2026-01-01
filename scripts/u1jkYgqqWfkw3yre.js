// TODO Delete in a future update

if (!this.item.system.treated)
{
  await this.actor.maintainCondition("defenceless", this.effect);
  await this.actor.maintainCondition("critical", this.effect);
}