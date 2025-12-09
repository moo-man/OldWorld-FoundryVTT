if (this.parent.itemTypes.wound.length == 0)
{
    this.script.notification("No Wounds!")
}
else 
{
    await this.parent.itemTypes.wound[0].delete();
}