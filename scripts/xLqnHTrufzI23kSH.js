if (await foundry.applications.api.Dialog.confirm({window: {title : this.effect.name}, content: `<p>Seek the <strong>Lady's Blessing</strong>?</p>`}))
  {
    this.script.message("Seeks the <strong>Lady's Blessing!</strong>")
    this.actor.applyEffect({effects: this.item.effects.contents[0]})
  }
this.effect.update({disabled: true})