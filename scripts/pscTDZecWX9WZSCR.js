let effects = [this.item.effects.get("nO3hAIOr6d39KRBm"), this.item.effects.get("qb7XS5N6hPZJaP8p"), this.item.effects.get("OWpEONf6bZjuKjfH")]

let choice = await ItemDialog.create(effects, 1, {text: "Select Gift", title: this.effect.name})

if (choice[0])
{
  ActiveEffect.create(choice[0].toObject(), {parent: this.actor})
}