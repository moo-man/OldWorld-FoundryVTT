if (args.test.result.miscasts)
{
  await this.actor.update({"system.magic.miscasts" : this.actor.system.magic.miscasts + args.test.result.miscasts})

  this.script.message(`Added ${args.test.result.miscasts} additional Miscasts`, {whisper: ChatMessage.getWhisperRecipients("GM")})
}