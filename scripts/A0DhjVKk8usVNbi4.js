if (args.test.result.successes > 0 && (await this.script.dialog("Use " + this.item.name + "?")))
{
  let roll = await new Roll("1d10").roll();
  roll.toMessage(this.script.getChatData());
  if (roll.total <= 8)
  {
    this.script.message("Deflected the attack!")
    await this.actor.update({"system.opposed" : ""});
  }
  else 
  {
    this.script.message("Failed to deflect the attack!");
  }
  this.item.update({name: this.item.setSpecifier("Broken")})
  this.effect.delete();
}