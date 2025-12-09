let roll = await new Roll("1d10").roll();
roll.toMessage(this.script.getChatData());
let item;
if (roll.total <= 2)
{
    item = this.actor.items.get("2qXAsbeF7GiMpIjF")
}
else if (roll.total <= 4)
{
    item = this.actor.items.get("FqlXgIIjaUHnR18G") 
}
else if (roll.total <= 6)
{
    item = this.actor.items.get("knNloAHN27jPDCtr") 
}
else if (roll.total <= 8)
{
    item = this.actor.items.get("EED5ARmKHrnJRujH") 
}
else if (roll.total <= 10)
{
    item = this.actor.items.get("8NSxsVltLCLWQ5jl") 
}

if (item)
{
    item.post(this.script.getChatData());
}