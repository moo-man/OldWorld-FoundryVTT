let value = await ValueDialog.create({text : "Specify Hatred Group", title : this.effect.name});

this.item.updateSource({name : this.item.setSpecifier(value)})
this.effect.updateSource({name : this.effect.setSpecifier(value)})