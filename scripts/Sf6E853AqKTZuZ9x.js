let roll = await new Roll("1d10").roll();

roll.toMessage(this.script.getChatData());
if (roll.total == 1)
{
  args.abort = true;
  this.script.message("Wound averted!");
}