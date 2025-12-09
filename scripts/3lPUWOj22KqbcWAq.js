if (this.item.type == "weapon")
{
  this.item.system.damage.value--;
}
else if (this.item.type == "armour" && this.item.system.isEquipped && this.item.system.resilience)
{
  this.item.system.resilience += " - 1"
  this.actor.system.resilience.value--;
}