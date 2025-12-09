Item.create({
  "type": "trapping",
  "name": "Vial of Invigorating Vitae",
  "img": this.effect.sourceItem.img,
  "effects" : [{
    "name" : "Consume Vial",
    "img" : this.effect.sourceItem.img,
    "system" : {
      "transferData" : {
          "type" : "target",
          "selfOnly" : true
      },
      "scriptData" : [{
          label : "Consume Vial",
          trigger : "immediate",
          script: `; 
          let wounds =  this.actor.itemTypes.wound.filter(i => !i.system.treated)
          for(let w of wounds)
          {
            await w.update({"system.treated" : true})
          }
          await this.script.message("Treated " + wounds.map(i => i.name).join(", "))
          await this.actor.removeCondition("drained"); await this.actor.removeCondition("burdened")
          `,
          options : {
            deleteEffect: true
          }
      }]
    }
  }]
}, {parent: this.actor}).then(_ => {
this.script.notification("Created Invigorating Vitae Vial")
})