if (this.actor.statuses.has("aim"))
{
  this.actor.effects.contents.find(i => i.statuses.has("aim"))?.delete();
  this.script.notification("Removed Aim Effect")
}