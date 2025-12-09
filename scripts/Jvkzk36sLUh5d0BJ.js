Item.create({
  name: this.effect.name,
  type : "weapon",
  img : "modules/tow-core/assets/icons/weapons/weapon.webp",
  system: {
      skill: "brawn",
      equipped: {value: true},
      grip: "1H",
      damage: {
        formula: "2",
        characteristic: "s",
        successes: true
      },
      range: {
        melee: 0
      }
  }
}, {parent: this.actor, fromEffect: this.effect.id})

this.script.notification(`Weapon Added`);