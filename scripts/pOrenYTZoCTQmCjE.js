if (args.opposed.outcome == "success")
{
  let magicalWeapon = args.defender.itemTypes.weapon.find(w => w.system.isMagical && w.system.isEquipped);

  if (magicalWeapon)
  {
    this.script.message(`Wraps around <strong>${magicalWeapon.name}</strong>!`)
  }
}