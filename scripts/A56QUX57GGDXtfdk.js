let target = await ValueDialog.create({text: "Enter Target", title: this.effect.name})

this.effect.update({name: this.effect.setSpecifier(target)})
this.item.update({name: this.item.setSpecifier(target)})

this.actor.addCondition("distracted");
this.script.message(`Pursuing <strong>${target}</strong>`)