let choice = await ItemDialog.create([{id: "0", name : "Armoured", img : this.effect.img},
{id: "1", name : "Babbler", img : this.effect.img},
{id: "2", name : "Bookrest", img : this.effect.img},
{id: "3", name : "Chaos Sink", img : this.effect.img},
{id: "4", name : "Combatant", img : this.effect.img},
{id: "5", name : "Flight", img : this.effect.img},
{id: "6", name : "Linked", img : this.effect.img},
{id: "7", name : "Poison Tongue", img : this.effect.img},
{id: "8", name : "Skulker", img : this.effect.img}], 1, {text: "Choose Option", title : this.effect.name});


if (choice[0])
{
  this.item.updateSource({name : this.item.setSpecifier(choice[0].name)})
}