this.script.message("Charge Gained")

let specifier = this.item.specifier || 0;
specifier++;
this.item.update({name: this.item.setSpecifier(specifier)});