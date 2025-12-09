if (this.actor.itemTypes.wound.length == 0)
{
    this.script.notification("No Wounds!")
}
else 
{
    await this.actor.itemTypes.wound[0].delete();
}