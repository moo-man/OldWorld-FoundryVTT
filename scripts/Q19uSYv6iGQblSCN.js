Item.create({
  name : this.effect.name,
  type: "ability",
  img: this.effect.img,
  system: {
    description: {
      public: "You may take an additional Melee attack as a second action every turn."
    }
  }
}, {parent: this.actor, fromEffect: this.effect.id})