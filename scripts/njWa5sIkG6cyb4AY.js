if (args.test?.weapon?.system.isMelee)
{ 
args.actor.addCondition("broken");
this.script.message("Added Broken")
}