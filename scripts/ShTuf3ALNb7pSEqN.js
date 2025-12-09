if (args.context.reload)
{
  return true;
}

if (!args.actor.statuses.has("aim"))
{
  this.script.notification("Must Aim!")
  args.abort = true;
}

return true;