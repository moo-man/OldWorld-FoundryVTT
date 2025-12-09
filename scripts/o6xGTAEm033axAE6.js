if (args.opposed.successes >= 3)
{
  this.script.message("Achieved 3+ successes on attack, setting damage to enough to Wound.");
  args.opposed.damage.value = Math.max(args.opposed.damage.value, (args.defender?.system.resilience.value + 1) || 0)
}