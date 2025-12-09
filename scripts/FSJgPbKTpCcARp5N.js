if (this.actor.itemTypes.spell.length == 0)
{
  let lore = (await ItemDialog.create(ItemDialog.objectToArray(game.oldworld.config.magicLore, this.item.img), 1, {title : this.effect.name, text : "Choose Magic Lore"}))[0];
  let spells = (await warhammer.utility.findAllItems("spell", "", true, ["system.lore"])).filter(i => i.system.lore == lore.id)
  let chosen = await ItemDialog.create(spells, 3, {indexed: true, title : this.effect.name, text : `Select 3 spells from the ${lore.name}`})
  this.actor.addEffectItems(chosen.map(i => i.uuid));
}