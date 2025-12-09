let effects = [this.item.effects.get("pACzZ97roOvWCq7U"), this.item.effects.get("IIKr0Qchk3awz100"), this.item.effects.get("TBjL4X1MNWG80tRs")]

let choice = await ItemDialog.create(effects, 1, {text: "Select Gift", title: this.effect.name})

if (choice[0])
{
  ActiveEffect.create(choice[0].toObject(), {parent: this.actor})
}