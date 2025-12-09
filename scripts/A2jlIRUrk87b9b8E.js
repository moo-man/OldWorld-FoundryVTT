if (!this.actor.hasCondition("staggered"))
  return 

if (args.type == "effect" && args.options.action == "create" && args.document.statuses.has("staggered"))
{
  this.script.message(`<p>Staggered Twice! <strong>${this.actor.name}</strong> flees!</p>`, {whisper: [game.user.id]})
}