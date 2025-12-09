await this.actor.addCondition("defenceless", this.effect);
if (!this.item.system.treated)
{
  await this.actor.maintainCondition("critical", this.effect);
}

await this.actor.maintainCondition("burdened", this.effect);
await this.actor.maintainCondition("drained", this.effect);