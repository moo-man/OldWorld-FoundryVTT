if (args.context.action == "aim")
{
  this.script.notification("Cannot Aim!", "error")
  args.abort = true;
}
else return true;