let characteristic = await game.oldworld.utility.characteristicDialog({title: this.effect.name});

let changes = foundry.utils.deepClone(this.item.effects.contents[1]).changes;
changes[0].key = changes[0].key.replace("*", characteristic);

this.item.effects.contents[1].updateSource({changes});

await this.item.updateSource({name: this.item.setSpecifier(game.oldworld.config.characteristics[characteristic]), "flags.whtow.characteristic" : characteristic});