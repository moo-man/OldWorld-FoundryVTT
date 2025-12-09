if (args.item.system.grip == "2H" && args.item.system.isMelee)
{
  if (args.item.system.modifiers.attacking.value < 0)
  {
    args.item.system.modifiers.attacking.value = 0
  }

  if (args.item.system.modifiers.defending.value < 0)
  {
    args.item.system.modifiers.attacking.value = 0
  }
}