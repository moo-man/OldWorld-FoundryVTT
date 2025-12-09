if (args.combat.combatant.actor.uuid === this.effect.sourceActor.uuid) 
{
  this.actor.removeCondition("blinded");
  this.effect.delete();
}