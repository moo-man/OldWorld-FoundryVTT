Item.create({
  name : this.effect.name,
  type: "ability",
  img: this.effect.img,
  system: {
    description: {
      public: "Your eyes glitter in darkness like those of a feline, allowing them to see as clearly at night as in the day."
    }
  }
}, {parent: this.actor, fromEffect: this.effect.id})