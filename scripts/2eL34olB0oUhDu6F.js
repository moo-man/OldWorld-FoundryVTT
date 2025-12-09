if (this.actor.system.origin?.document)
{
    for(let c in this.actor.system.characteristics)
    {
        this.actor.system.characteristics[c].max += 2;
    }
}