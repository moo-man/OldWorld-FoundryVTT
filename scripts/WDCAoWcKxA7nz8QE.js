if (args.defender)
{
  if (args.defenderTest.failed)
  {
    args.defender.applyEffect({effects: this.item.effects.getName("Distracted")});
  }
}