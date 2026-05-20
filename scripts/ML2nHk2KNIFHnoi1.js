if (this.actor.type == "character" || this.actor.system.hasThresholds)
{ 
  this.script.message(`Can reroll any or all dice in the Wound Roll. Remove this effect from @UUID[${this.item.uuid}] if used.`, {whisper: [game.user.id]});
}