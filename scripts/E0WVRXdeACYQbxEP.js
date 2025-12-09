Item.create({
  "name": "Skull Bash",
  "type": "ability",
  "img": "modules/tow-core/assets/icons/spells/necromancy.webp",
  "system": {
      "damage": {
          "formula": "6"
      },
      "attack": {
          "skill": "shooting",
          "range": {
              "min": 3,
              "max": 3,
              "melee": 0
          },
          "traits": "Successful attacks inflict the Ablaze condition"
      }
  },
  "effects": [
      {
          "img": "systems/whtow/assets/icons/conditions/ablaze.svg",
          "description": "",
          "statuses": [
              "ablaze"
          ],
          "name": "Ablaze",
          "system": {
              "transferData": {
                  "type": "damage",
                  "originalType": "document",
                  "documentType": "Actor",
              }
          },
      },
      {
          "name": "Skull Bash",
          "img": "modules/tow-core/assets/icons/spells/necromancy.webp",
          "_id": "IAgl7llSCnyQxZ7a",
          "type": "base",
          "system": {
              "transferData": {
                  "type": "document",
                  "originalType": "document",
                  "documentType": "Item",
              },
              "scriptData": [
                  {
                      "script": "args.fields.penalty = 0;\nargs.fields.bonus = 0;\nargs.data.dice = 3\nargs.fields.target = 3",
                      "label": "3d/3",
                      "trigger": "dialog",
                      "options": {
                          "targeter": false,
                          "defending": false,
                          "runIfDisabled": false,
                          "hideScript": "",
                          "activateScript": "return true;",
                          "submissionScript": "",
                          "deleteEffect": false,
                          "showDuplicates": false
                      },
                      "async": false
                  }
              ],
          },
        }]
}, {parent: this.actor, fromEffect: this.effect.id})