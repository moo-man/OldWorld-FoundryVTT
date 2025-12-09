if (args.test.context.reload && args.test.succeeded)
{
  let item = await fromUuid(args.test.context.reload);
  if (item.system.reload.current + args.test.result.successes >= item.system.reload.value)
  {
    if (await foundry.applications.api.Dialog.confirm({window: {title : this.effect.name}, content : `<p>Add <strong>Extra Modifications</strong> to ${item.name}?</p>`}))
      {
        let effect = this.item.effects.contents[1].toObject();
        effect.system.itemTargetData = {ids : [item.id]};
        effect.statuses.push("extra-modifications");
        effect.name += ` (${item.name})`;
        this.actor.applyEffect({effectData: effect})
      }
  }
}