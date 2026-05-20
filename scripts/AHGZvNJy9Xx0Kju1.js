let characteristic = await game.oldworld.utility.characteristicDialog({title: this.effect.name, text: "Select Characteristic"});

this.item.effects.contents[1].updateSource({changes: [{key: `system.characteristics.${characteristic}.value`, mode: 2, value: 1}]});

await this.item.updateSource({name: this.item.setSpecifier(game.oldworld.config.characteristics[characteristic]), "flags.whtow.characteristic" : characteristic});