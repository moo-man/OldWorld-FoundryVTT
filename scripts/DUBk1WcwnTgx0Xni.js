// TODO Delete in a future update


if (!this.item.system.treated)
{
  await this.actor.maintainCondition("prone", this.effect);
  await this.actor.maintainCondition("critical", this.effect);
}

await this.actor.maintainCondition("burdened", this.effect);