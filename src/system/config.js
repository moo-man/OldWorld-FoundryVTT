const OLDWORLD = {
    characteristics : {
        ws : "TOW.CharName.WeaponSkill",
        bs : "TOW.CharName.BallisticSkill",
        s : "TOW.CharName.Strength",
        t : "TOW.CharName.Toughness",
        i : "TOW.CharName.Initiative",
        ag : "TOW.CharName.Agility",
        re : "TOW.CharName.Reason",
        fel : "TOW.CharName.Fellowship",
    },

    characteristicAbbrev : {
        ws : "TOW.CharAbbrev.WeaponSkill",
        bs : "TOW.CharAbbrev.BallisticSkill",
        s : "TOW.CharAbbrev.Strength",
        t : "TOW.CharAbbrev.Toughness",
        i : "TOW.CharAbbrev.Initiative",
        ag : "TOW.CharAbbrev.Agility",
        re : "TOW.CharAbbrev.Reason",
        fel : "TOW.CharAbbrev.Fellowship",
    },

    skills : {
        melee : "TOW.SkillName.Melee",
        defence : "TOW.SkillName.Defence",
        shooting : "TOW.SkillName.Shooting",
        throwing : "TOW.SkillName.Throwing",
        brawn : "TOW.SkillName.Brawn",
        toil : "TOW.SkillName.Toil",
        survival : "TOW.SkillName.Survival",
        endurance : "TOW.SkillName.Endurance",
        awareness : "TOW.SkillName.Awareness",
        dexterity : "TOW.SkillName.Dexterity",
        athletics : "TOW.SkillName.Athletics",
        stealth : "TOW.SkillName.Stealth",
        willpower : "TOW.SkillName.Willpower",
        recall : "TOW.SkillName.Recall",
        leadership : "TOW.SkillName.Leadership",
        charm : "TOW.SkillName.Charm",
    },

    status : {
        brass : "TOW.StatusName.Brass",
        silver : "TOW.StatusName.Silver",
        gold : "TOW.StatusName.Gold",

    },

    range : {
        0 : "TOW.RangeType.Close",
        1 : "TOW.RangeType.Short",
        2 : "TOW.RangeType.Medium",
        3 : "TOW.RangeType.Long",
        4 : "TOW.RangeType.Extreme"
    },

    assetCategory : {
        "animalVehicle" : "TOW.AssetCategory.AnimalVehicle",
        "buildingEstablishment" : "TOW.AssetCategory.BuildingEstablishment",
        "other" : "TOW.AssetCategory.Other"
    },

    magicLore : {
        battle : "TOW.MagicLore.Battle",
        elementalism : "TOW.MagicLore.Elementalism",
        illusion : "TOW.MagicLore.Illusion",
        necromancy : "TOW.MagicLore.Necromancy"
    },

    target : {
        self : "TOW.TargetType.Self",
        creature : "TOW.TargetType.Creature",
        zone : "TOW.TargetType.Zone",
        object : "TOW.TargetType.Object"
    },

    duration : {
        immediate : "TOW.DurationType.Immediate",
        instant : "TOW.DurationType.Immediate",
        battle : "TOW.DurationType.Battle",
        permanent : "TOW.DurationType.Permanent",
        varies : "TOW.DurationType.Varies",
        turns : "TOW.DurationType.Turns",
        // Needs to support Potency Turns, custom text, 
    },

    woundHealing : {
        1 : "TOW.WoundHealing.CatchYourBreath",
        2 : "TOW.WoundHealing.Respite",
        3 : "TOW.WoundHealing.RestRecovery",
        4 : "TOW.WoundHealing.Surgery",
        5 : "TOW.WoundHealing.NA",
    },


    speed : {
        "slow" : "TOW.Speeds.Slow",
        "normal" : "TOW.Speeds.Normal",
        "fast" : "TOW.Speeds.Fast",
    },

    npcType : {
        minion : "TOW.NPC.Minion",
        brute : "TOW.NPC.Brute",
        champion : "TOW.NPC.Champion",
        monstrosity : "TOW.NPC.Monstrosity",
    },

    effectScripts : {},

    transferTypes : {
        document : "WH.TransferType.Document",
        damage : "WH.TransferType.Damage",
        target : "WH.TransferType.Target",
        zone : "WH.TransferType.Zone",
        other : "WH.TransferType.Other"
    },

    placeholderItemData : {
        type : "trapping",
        img : "modules/warhammer-lib/assets/blank.png"
    },

    conditions : {
        ablaze : {
            img: "systems/whtow/assets/icons/conditions/ablaze.svg",
            description : "You are on fire, scorched by flames that burn your clothes and sear your flesh.",
            statuses : ["ablaze"],
            name: "TOW.ConditionName.Ablaze",
            system: {
                transferData : {
                    avoidTest: {
                        prevention: false,
                        skill: "athletics"
                    }
                },
                scriptData: [{
                    label: "Hazard",
                    trigger: "endTurn",
                    script: "this.actor.system.rollHazard('endurance', 2, {appendTitle : ` - ${this.effect.name}`})"
                }]
            }
        },
        blinded : {
            img: "systems/whtow/assets/icons/conditions/blinded.svg",
            description : "You cannot see — you’re stumbling around in the dark, trying to orient yourself.",
            statuses : ["blinded", "blind"],
            name: "TOW.ConditionName.Blinded",
            system: {
                transferData : {

                    avoidTest: {
                        prevention: false,
                        skill: "awareness"
                    }
                },
                scriptData: [{
                    label: "Any Tests with a visual component",
                    trigger: "dialog",
                    script: "args.fields.grim++",
                    options : {
                        activateScript: "return ['melee', 'defence', 'shooting', 'throwing'].includes(args.skill)"
                    }
                }]
            }
        },
        broken : {
            img: "systems/whtow/assets/icons/conditions/broken.svg",
            description : "Your courage has failed, and all you can think of is retreating to a place of safety.",
            statuses : ["broken"],
            name: "TOW.ConditionName.Broken",
            system: {
                transferData : {

                    avoidTest: {
                        prevention: false,
                        skill: "willpower"
                    }
                }
            }
        },
        burdened : {
            img: "systems/whtow/assets/icons/conditions/burdened.svg",
            description : "You are encumbered by heavy equipment, binding restraints, or an incapacitating injury.",
            statuses : ["burdened"],
            name: "TOW.ConditionName.Burdened",
            system: {
                transferData : {
                    // TODO prevent manoeuvre action
                    avoidTest: {
                        prevention: false,
                        skill: "brawn"
                    }
                }
            }
        },
        critical : {
            img: "systems/whtow/assets/icons/conditions/critical.svg",
            description : "Your wounds are so severe you might expire from blood loss, shock, or suffocation.",
            statuses : ["critical"],
            name: "TOW.ConditionName.CriticallyInjured",
            system: {
                transferData : {

                    avoidTest: {
                        prevention: false,
                        skill: "recall"
                    }
                },
                scriptData: [{
                    label: "Defenceless",
                    trigger: "endTurn",
                    script: `
                    let test = await this.actor.setupSkillTest('endurance', {appendTitle: \` - \${this.effect.name}\`}); 
                    
                    if (test.failed) 
                    {
                        if (this.actor.hasCondition("defenceless"))
                        {
                            this.actor.addCondition("dead");
                        }
                        else 
                        {
                            this.actor.addCondition("defenceless");
                        }
                    }
                        `
                }]
            }
        },
        deafened : {
            img: "systems/whtow/assets/icons/conditions/deafened.svg",
            description : "You can’t hear anything, or are subjected to a loud noise that drowns out other sounds.",
            statuses : ["deafened"],
            name: "TOW.ConditionName.Deafened",
            system: {
                transferData : {
                    // TODO prevent help action
                    avoidTest: {
                        prevention: false,
                        skill: "awareness"
                    }
                }
            }
        },
        defenceless : {
            img: "systems/whtow/assets/icons/conditions/defenceless.svg",
            description : "You are entirely at your enemy’s mercy.",
            statuses : ["defenceless"],
            name: "TOW.ConditionName.Defenceless"
        },
        distracted : {
            img: "systems/whtow/assets/icons/conditions/distracted.svg",
            description : "Your attention wanders to feelings of doubt, rage, shame, or desire, instead of focussing on the task at hand. ",
            statuses : ["distracted"],
            name: "TOW.ConditionName.Distracted",
            system: {
                transferData : {

                    avoidTest: {
                        prevention: false,
                        skill: "willpower"
                    }
                },
                scriptData: [{
                    label: "Any Tests while Distracted",
                    trigger: "dialog",
                    script: "args.fields.penalty++",
                    // TODO no penalty on distraction target
                    options : {
                        activateScript: "return true;"
                    }
                }]
            }
        },
        drained : {
            img: "systems/whtow/assets/icons/conditions/drained.svg",
            description : "Your concentration and fighting strength is compromised by sickness or exhaustion.",
            statuses : ["drained"],
            name: "TOW.ConditionName.Drained",
            system: {
                transferData : {

                    avoidTest: {
                        prevention: false,
                        skill: "endurance"
                    }
                },
                scriptData: [{
                    label: "No Bonuses on any Test",
                    trigger: "dialog",
                    script: "args.fields.bonus = 0; args.fields.grim = 0;",
                    options : {
                        activateScript: "return true;"
                    }
                }]
            }
        },
        prone : {
            img: "systems/whtow/assets/icons/conditions/prone.svg",
            description : "You are knocked flat, lying down, or kneeling on the floor.",
            statuses : ["prone"],
            name: "TOW.ConditionName.Prone",
            system: {
                scriptData: [{
                    label: "Target is Prone",
                    trigger: "dialog",
                    script: "if (args.weapon.isMelee) args.fields.bonus++; if (args.weapon.isRanged) args.fields.penalty++;",
                    options : {
                        hideScript: "return !args.weapon",
                        activateScript: "return true;",
                        targeter: true
                    }
                }]
            }
        },
        staggered : {
            img: "systems/whtow/assets/icons/conditions/staggered.svg",
            description : "You are battered, bruised, or otherwise reeling from an enemy attack.",
            statuses : ["staggered"],
            name: "TOW.ConditionName.Staggered"
        }
    },

    actions: {
            aim : {
                label : "TOW.Action.Aim",
                effect :         
                {
                    name: "TOW.Action.Aim",
                    statuses : ["aim"],
                    img: "icons/svg/aura.svg",
                    system : {
                            scriptData: [{
                                label : "Aimed at Target",
                                trigger: "dialog",
                                script : "args.fields.bonus += this.effect.getFlag('whtow', 'aim')?.successes || 0",
                                options :{ 
                                    hideScript : "return !args.weapon || args.weapon.system.isMelee || args.target?.uuid != this.effect.getFlag('whtow', 'aim')?.uuid",
                                    activateScript : "return args.target?.uuid == this.effect.getFlag('whtow', 'aim')?.uuid",
                                    submissionScript: "this.effect.delete();"
                                }
                            }]
                        }
                    
                },
                test : {},
                script : async function(actor)
                {
                    let target = Array.from(game.user.targets)[0]?.actor;
                    if (!target)
                    {
                        ui.notifications.warn("No Target!")
                    }
                    let effect = foundry.utils.deepClone(this.effect);
                    let test = await actor.setupSkillTest("awareness", {action: "aim", skipTargets : true, action: "aim"})
                    if (test.succeeded)
                    {
                        foundry.utils.setProperty(effect, "flags.whtow.aim", {uuid: target?.uuid, successes : test.result.successes})
                        if (target)
                        {
                            effect.name += ` (${target.name})`
                        }
                        actor.runScripts("doAction", {action: "aim", target, effect, test})

                        actor.applyEffect({effectData : [effect]});
                    }
                    else 
                    {
                        actor.runScripts("doAction", {action: "aim", target, effect, test})
                    }

                }
            },
            help : {
                label : "TOW.Action.Help",
                effect :  {
                    name: "TOW.Action.Help",
                    statuses : ["help"],
                    img: "icons/svg/aura.svg",
                    system : {
                        scriptData: [{
                            label : "Helped by @SOURCE",
                            trigger: "dialog",
                            script : "args.fields.bonus += this.effect.getFlag('whtow', 'help')?.successes || 0",
                            options :{ 
                                hideScript: "",
                                activateScript: "return true;",
                                submissionScript: "this.effect.delete();"
                            }
                        }]
                    }
                },
                test : {},
                script : async function(actor)
                {
                    let target = Array.from(game.user.targets)[0]?.actor;
                    if (!target)
                    {
                        ui.notifications.warn("No Target!")
                    }
                    let effect = foundry.utils.deepClone(this.effect);
                    let skill = await game.oldworld.utility.skillDialog({title : "Help"})
                    let test = await actor.setupSkillTest(skill, {action: "help", skipTargets : true})

                    if (test.succeeded)
                    {
                        foundry.utils.setProperty(effect, "flags.whtow.help", {successes : test.result.successes})
                        effect.origin = actor.uuid
                        effect.system.scriptData[0].label = effect.system.scriptData[0].label.replace("@SOURCE", actor.name)
                        actor.runScripts("doAction", {action: "help", target, effect, test})
                        if (target)
                        {
                            target.applyEffect({effectData : [effect]});
                        }
                    }
                    else 
                    {
                        actor.runScripts("doAction", {action: "help", target, effect, test})
                    }

                }
            },
            improvise : {
                label : "TOW.Action.Improvise",
                effect : {
                    label: "TOW.Action.Improvise",
                    img: "icons/svg/aura.svg",
                    statuses : ["improvise"],
                    system : {
                            scriptData: []
                        },
                    
                },
                test : {
                    chooseSkill : true
                }
            },
            manoeuvre : {
                label : "TOW.Action.Manoeuvre",
                subActions : {
                    run : {
                        label : "Run",
                        description : "run description",
                        script : async function(actor) 
                        {   
                            if (await foundry.applications.api.Dialog.confirm({
                                window: {title: "Run"},
                                content : "<p>Test <strong>Athletics</strong> to run an extra Zone?</p>",
                            }))
                            {
                                let test = await actor.setupSkillTest("athletics", {action: "manoeuvre", subAction:"run", skipTargets : true})
                                if (test.failed && !actor.system.isStaggered)
                                {
                                    actor.addCondition("staggered");
                                }
                            }
                            else 
                            {
                                game.oldworld.config.rollClasses.ActionUse.fromAction("manoeuvre", actor, {subAction: "run"})
                            }
                        }
                    },
                    charge : {
                        label : "Charge",
                        description : "",
                        effect : {
                            name : "Charging",
                            statuses : ["charging"],
                            system : {
                                scriptData: [{
                                    label : "Charging",
                                    trigger: "dialog",
                                    script : "args.fields.bonus += 1",
                                    options :{ 
                                        hideScript: "return !args.weapon || args.weapon.system.isRanged",
                                        activateScript: "return true;",
                                        submissionScript: "this.effect.delete();"
                                    }
                                }]
                            }
                        },
                        script : async function(actor) 
                        {   
                            if (await foundry.applications.api.Dialog.confirm({
                                window: {title: "Run"},
                                content : "<p>Test <strong>Athletics</strong> to charge at Long Range?</p>",
                            }))
                            {
                                let test = await actor.setupSkillTest("athletics", {action: "manoeuvre", subAction:"charge", skipTargets : true})
                                if (test.failed && !actor.system.isStaggered)
                                {
                                    actor.addCondition("staggered");
                                }
                                else 
                                {
                                    let effect = foundry.utils.deepClone(this.effect);
                                    actor.applyEffect({effectData : [effect]});
                                }
                            }
                            else 
                            {
                                game.oldworld.config.rollClasses.ActionUse.fromAction("manoeuvre", actor, {subAction: "charge"})
                                let effect = foundry.utils.deepClone(this.effect);
                                actor.applyEffect({effectData : [effect]});
                            }
                        }
                    },
                    moveQuietly : {
                        label : "Move Quietly",
                        description : "",
                        test : {
                            skill : "stealth"
                        }
                    },
                    moveCarefully : {
                        label : "Move Carefully",
                        description : "test description",
                        test : {
                            skill : "awareness"
                        } 
                    }
                }
            },
            recover : {
                label : "TOW.Action.Recover",
                effect : {
                    label: "TOW.Action.Recover",
                    img: "icons/svg/aura.svg",
                    statuses : ["recover"],
                    system : {
                            scriptData: []
                        },
                    
                },
                removeStaggered : {
                    name : "Remove Staggered",
                    statuses : ["recover"],
                    system : {
                        scriptData: [{
                            label : "Remove Staggered",
                            trigger: "immediate",
                            script : "this.actor.removeCondition('staggered')",
                            options : {
                                deleteEffect: true
                            }
                        }]
                    }
                },
                removeProne: {
                    name : "Remove Prone",
                    statuses : ["recover"],
                    system : {
                        scriptData: [{
                            label : "Remove Prone",
                            trigger: "immediate",
                            script : "this.actor.removeCondition('prone')",
                            options : {
                                deleteEffect: true
                            }
                        }]
                    }
                },
                script : async function(actor)
                {
                    game.oldworld.config.rollClasses.ActionUse.fromAction("recover", actor)

                    let choice = await foundry.applications.api.Dialog.wait({
                        window : {title : "Recover"},
                        buttons : [
                            {
                                action : "recover",
                                label : "Recover"
                            },
                            {
                                action : "treat",
                                label : "Treat Wound"
                            },
                            {
                                action : "condition",
                                label : "Remove Condition"
                            },
                        ]
                    })

                    if (choice == "recover")
                    {
                        let target = Array.from(game.user.targets)[0]?.actor;

                        if (actor.system.isStaggered)
                        {
                            actor.applyEffect({effectData: [this.removeStaggered]})
                            ChatMessage.create({content : "Removed Staggered", speaker : {alias: actor.name}, flavor: "Recover"});
                        }
                        else if (target?.system.isStaggered)
                        {
                            target.applyEffect({effectData: [this.removeStaggered]})
                            ChatMessage.create({content : `Removed Staggered on ${target.name}`, speaker : {alias: actor.name}, flavor: "Recover"});
                        }

                        if (actor.system.isProne)
                        {
                            actor.applyEffect({effectData: [this.removeProne]})
                            ChatMessage.create({content : "Removed Prone", speaker : {alias: actor.name}, flavor: "Recover"});
                        }
                        else if (target?.system.isProne)
                        {
                            target.applyEffect({effectData: [this.removeProne]})
                            ChatMessage.create({content : `Removed Prone on ${target.name}`, speaker : {alias: actor.name}, flavor: "Recover"});
                        }

                        actor.system.modifyMiscasts(-1, {flavor: this.label})
                    }
                    else if (choice == "treat")
                    {
                        let target = Array.from(game.user.targets)[0]?.actor || actor;

                        let wounds = target.itemTypes.wound.filter(i => !i.system.treated);

                        if (wounds.length == 0)
                        {
                            ui.notifications.error("No untreated Wounds on " + target.name);
                        }
                        else 
                        {
                            let choice = await ItemDialog.create(wounds, 1, {title: "Treat Wound", text: "Select Wound to Treat"});

                            if (choice[0])
                            {
                                if (!actor.itemTypes.lore.find(i => i.name.toLowerCase() == "anatomy"))
                                {
                                    let test = await actor.setupSkillTest("recall", {appendTitle : "Treat Wound"})
                                    if (test.failed)
                                    {
                                        return
                                    }
                                }

                                let content = `Treated ${choice[0].name}` (actor.uuid != target.uuid) ? ` on ${target.name}` : "";
                                ChatMessage.create({content, speaker : {alias: actor.name}, flavor: "Treat Wound"});
                                choice[0].update({"system.treated" : true});
                            }
                        }

                    }
                    else if (choice == "condition")
                    {
                        let target = Array.from(game.user.targets)[0]?.actor || actor;
                        let conditions = target.effects.filter(e => e.isCondition);
                        let choice = await ItemDialog.create(conditions, 1, {title: "Remove Condition", text: "Select Condition to Test against"});
                        if (choice[0])
                        {
                            if (await choice.avoidTest())
                            {
                                let content = `Removed ${choice[0].name}` (actor.uuid != target.uuid) ? ` on ${target.name}` : "";
                                ChatMessage.create({content, speaker : {alias: actor.name}, flavor: "Remove Condition"});
                            }
                        }
                    }
                }
            },
    },
    
    // foundry.utils.mergeObject(scriptTriggers, {
    
    //     equipToggle : "WH.Trigger.EquipToggle",
    
    //     takeDamageMod : "WH.Trigger.TakeDamageMod",
    //     applyDamageMod : "WH.Trigger.ApplyDamageMod",
    
    //     preRollTest : "WH.Trigger.PreRollTest",
    //     preRollCombatTest : "WH.Trigger.PreRollCombatTest",
    //     preRollSpellTest : "WH.Trigger.PreRollSpellTest",
    
    //     rollTest : "WH.Trigger.RollTest",
    //     rollCombatTest : "WH.Trigger.RollCombatTest",
    //     rollSpellTest : "WH.Trigger.RollSpellTest",
    // }),
    
    effectKeysTemplate : "systems/whtow/templates/apps/effect-key-options.hbs",
    avoidTestTemplate : "systems/whtow/templates/apps/effect-avoid-test.hbs",
    effectScripts : {},
    
    logFormat : [`%OLD WORLD` + `%c @MESSAGE`, "color: #DDD;background: #065c63;font-weight:bold", "color: unset"],
    
    rollClasses : {},
    
    bugReporterConfig : {
        endpoint  : "https://aa5qja71ih.execute-api.us-east-2.amazonaws.com/Prod/oldworld",
        githubURL : "https://api.github.com/repos/moo-man/OldWorld-FoundryVTT/",
        successMessage : "Thank you for your submission. If you wish to monitor or follow up with additional details like screenshots, you can find your issue here: @URL",
        troubleshootingURL : "https://moo-man.github.io/OldWorld-FoundryVTT/pages/troubleshooting.html"
    },
    
    premiumModules : {
        "whtow" : "Old World System",
    }
    
};


// Lists conditions without major/minor
const TOW_CONFIG = {
    statusEffects : [
        {
            img: "systems/whtow/assets/icons/conditions/ablaze.svg",
            id: "ablaze",
            description : "You are on fire, scorched by flames that burn your clothes and sear your flesh.",
            statuses : ["ablaze"],
            name: "TOW.ConditionName.Ablaze"
        },
        {
            img: "systems/whtow/assets/icons/conditions/blinded.svg",
            id: "blinded",
            description : "You cannot see — you’re stumbling around in the dark, trying to orient yourself.",
            statuses : ["blinded", "blind"],
            name: "TOW.ConditionName.Blinded"
        },
        {
            img: "systems/whtow/assets/icons/conditions/broken.svg",
            id: "broken",
            description : "Your courage has failed, and all you can think of is retreating to a place of safety.",
            statuses : ["broken"],
            name: "TOW.ConditionName.Broken"
        },
        {
            img: "systems/whtow/assets/icons/conditions/burdened.svg",
            id: "burdened",
            description : "You are encumbered by heavy equipment, binding restraints, or an incapacitating injury.",
            statuses : ["burdened"],
            name: "TOW.ConditionName.Burdened"
        },
        {
            img: "systems/whtow/assets/icons/conditions/critical.svg",
            id: "critical",
            description : "Your wounds are so severe you might expire from blood loss, shock, or suffocation.",
            statuses : ["critical"],
            name: "TOW.ConditionName.CriticallyInjured"
        },
        {
            img: "systems/whtow/assets/icons/conditions/deafened.svg",
            id: "deafened",
            description : "You can’t hear anything, or are subjected to a loud noise that drowns out other sounds.",
            statuses : ["deafened"],
            name: "TOW.ConditionName.Deafened"
        },
        {
            img: "systems/whtow/assets/icons/conditions/defenceless.svg",
            id: "defenceless",
            description : "You are entirely at your enemy’s mercy.",
            statuses : ["defenceless"],
            name: "TOW.ConditionName.Defenceless"
        },
        {
            img: "systems/whtow/assets/icons/conditions/distracted.svg",
            id: "distracted",
            description : "Your attention wanders to feelings of doubt, rage, shame, or desire, instead of focussing on the task at hand. ",
            statuses : ["distracted"],
            name: "TOW.ConditionName.Distracted"
        },
        {
            img: "systems/whtow/assets/icons/conditions/drained.svg",
            id: "drained",
            description : "Your concentration and fighting strength is compromised by sickness or exhaustion.",
            statuses : ["drained"],
            name: "TOW.ConditionName.Drained"
        },
        {
            img: "systems/whtow/assets/icons/conditions/prone.svg",
            id: "prone",
            description : "You are knocked flat, lying down, or kneeling on the floor.",
            statuses : ["prone"],
            name: "TOW.ConditionName.Prone"
        },
        {
            img: "systems/whtow/assets/icons/conditions/staggered.svg",
            id: "staggered",
            description : "You are battered, bruised, or otherwise reeling from an enemy attack.",
            statuses : ["staggered"],
            name: "TOW.ConditionName.Staggered"
        },
    ]
};


CONFIG.TextEditor.enrichers = CONFIG.TextEditor.enrichers.concat([

]);

foundry.utils.mergeObject(OLDWORLD, defaultWarhammerConfig)
OLDWORLD.scriptTriggers = {
    manual : "WH.Trigger.Manual",
    immediate : "WH.Trigger.Immediate",
    dialog : "WH.Trigger.Dialog",

    onCreate : "WH.Trigger.OnCreate",

    updateDocument : "WH.Trigger.UpdateDocument",

    doAction: "Do Action",

    preRollTest : "Pre-Roll Test",
    rollTest : "Roll Test",

    startCombat  : "WH.Trigger.StartCombat",
    startRound : "WH.Trigger.StartRound",
    startTurn : "Start Turn",
    updateCombat  : "WH.Trigger.UpdateCombat",
    endTurn : "End Turn",
    endRound : "End Round",
    endCombat : "End Combat",

    inflictWound: "Inflict Wound",
    inflictStaggered: "Inflict Staggered",
    inflictProne: "Inflict Prone",
    inflictGiveGround: "Inflict Give Ground",

    receiveWound: "Receive Wound",
    receiveStaggered: "Receive Staggered",
    receiveProne: "Receive Prone",
    receiveGiveGround: "Receive Give Ground",

    // IN LIBRARY
    preUpdateDocument : "WH.Trigger.PreUpdateDocument",
    prepareBaseData : "WH.Trigger.PrepareBaseData",


};
export {OLDWORLD, TOW_CONFIG};