let lore = (await ItemDialog.create(ItemDialog.objectToArray(game.oldworld.config.magicLore, this.item.img), 1, {title : this.effect.name, text : "Choose Magic Lore"}))[0];

this.item.updateSource({name: this.item.setSpecifier(lore.name)});
this.effect.updateSource({name: this.effect.setSpecifier(lore.name)});