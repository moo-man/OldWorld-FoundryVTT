this.actor.effects.find(e => e.statuses.has("extra-modifications"))?.delete();
// Not sure why this.effect.delete() doesn't work, probably because it's an "item" effect?