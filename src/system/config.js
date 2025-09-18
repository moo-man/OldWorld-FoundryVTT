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
            name: "TOW.ConditionName.Ablaze"
        },
        blinded : {
            img: "systems/whtow/assets/icons/conditions/blinded.svg",
            description : "You cannot see — you’re stumbling around in the dark, trying to orient yourself.",
            statuses : ["blinded", "blind"],
            name: "TOW.ConditionName.Blinded"
        },
        broken : {
            img: "systems/whtow/assets/icons/conditions/broken.svg",
            description : "Your courage has failed, and all you can think of is retreating to a place of safety.",
            statuses : ["broken"],
            name: "TOW.ConditionName.Broken"
        },
        burdened : {
            img: "systems/whtow/assets/icons/conditions/burdened.svg",
            description : "You are encumbered by heavy equipment, binding restraints, or an incapacitating injury.",
            statuses : ["burdened"],
            name: "TOW.ConditionName.Burdened"
        },
        critical : {
            img: "systems/whtow/assets/icons/conditions/critical.svg",
            description : "Your wounds are so severe you might expire from blood loss, shock, or suffocation.",
            statuses : ["critical"],
            name: "TOW.ConditionName.CriticallyInjured"
        },
        deafened : {
            img: "systems/whtow/assets/icons/conditions/deafened.svg",
            description : "You can’t hear anything, or are subjected to a loud noise that drowns out other sounds.",
            statuses : ["deafened"],
            name: "TOW.ConditionName.Deafened"
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
            name: "TOW.ConditionName.Distracted"
        },
        drained : {
            img: "systems/whtow/assets/icons/conditions/drained.svg",
            description : "Your concentration and fighting strength is compromised by sickness or exhaustion.",
            statuses : ["drained"],
            name: "TOW.ConditionName.Drained"
        },
        prone : {
            img: "systems/whtow/assets/icons/conditions/prone.svg",
            description : "You are knocked flat, lying down, or kneeling on the floor.",
            statuses : ["prone"],
            name: "TOW.ConditionName.Prone"
        },
        staggered : {
            img: "systems/whtow/assets/icons/conditions/staggered.svg",
            description : "You are battered, bruised, or otherwise reeling from an enemy attack.",
            statuses : ["staggered"],
            name: "TOW.ConditionName.Staggered"
        }
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
export {OLDWORLD, TOW_CONFIG};