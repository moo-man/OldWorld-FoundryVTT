let lores = (await warhammer.utility.findAllItems("lore", "", true, ["system.category"])).filter(i => ["Academic", "Cultural", "Enemy"].includes(i.system.category))

let chosen = await ItemDialog.create(lores, 1, {title : this.effect.name, text : "Choose Lore"})

this.script.message(`Chose ${chosen[0].name}`);
this.item.update({name : this.item.setSpecifier(chosen[0].name)})