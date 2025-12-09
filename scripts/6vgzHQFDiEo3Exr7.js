Item.create({
    "type": "weapon",
    "name": this.effect.name,
    "system": {
        "skill": "brawn",
        "description": {
            "public": this.effect.sourceItem.system.description.public
        },
        "equipped": {
            "value": true
        },
        "range": {
            "melee": 0
        },
        "damage": {
            "formula": "5 + " + this.effect.sourceTest.context.potency,
            "magical": true
        }
    },
    "img": this.effect.sourceItem.img
}, {parent: this.actor, fromEffect: this.effect.id})