
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
        maintenance : "TOW.SkillName.Maintenance",
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
        0 : "TOW.Range.Close",
        1 : "TOW.Range.Short",
        2 : "TOW.Range.Medium",
        3 : "TOW.Range.Long",
        4 : "TOW.Range.Extreme"
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


    effectScripts : {},

    transferTypes : {
        document : "WH.TransferType.Document",
        damage : "WH.TransferType.Damage",
        target : "WH.TransferType.Target",
        zone : "WH.TransferType.Zone",
        other : "WH.TransferType.Other"
    },


    
    // mergeObject(scriptTriggers, {
    
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
            icon: "systems/whtow/assets/icons/conditions/ablaze.svg",
            id: "ablaze",
            statuses : ["ablaze"],
            name: "IMPMAL.ConditionAblaze",
            title: "IMPMAL.ConditionAblaze"
        },
        {
            icon: "systems/whtow/assets/icons/conditions/bleeding.svg",
            id: "bleeding",
            statuses : ["bleeding"],
            name: "IMPMAL.ConditionBleeding",
            title: "IMPMAL.ConditionBleeding"
        },
        {
            icon: "systems/whtow/assets/icons/conditions/blinded.svg",
            id: "blinded",
            statuses : ["blinded"],
            name: "IMPMAL.ConditionBlinded",
            title: "IMPMAL.ConditionBlinded"
        },
        {
            icon: "systems/whtow/assets/icons/conditions/deafened.svg",
            id: "deafened",
            statuses : ["deafened"],
            name: "IMPMAL.ConditionDeafened",
            title: "IMPMAL.ConditionDeafened"
        },
        {
            icon: "systems/whtow/assets/icons/conditions/fatigued.svg",
            id: "fatigued",
            statuses : ["fatigued"],
            name: "IMPMAL.ConditionFatigued",
            title: "IMPMAL.ConditionFatigued"
        },
        {
            icon: "systems/whtow/assets/icons/conditions/frightened.svg",
            id: "frightened",
            statuses : ["frightened"],
            name: "IMPMAL.ConditionFrightened",
            title: "IMPMAL.ConditionFrightened"
        },
        {
            icon: "systems/whtow/assets/icons/conditions/incapacitated.svg",
            id: "incapacitated",
            statuses : ["incapacitated"],
            name: "IMPMAL.ConditionIncapacitated",
            title: "IMPMAL.ConditionIncapacitated"
        },
        {
            icon: "systems/whtow/assets/icons/conditions/overburdened.svg",
            id: "overburdened",
            statuses : ["overburdened"],
            name: "IMPMAL.ConditionOverburdened",
            title: "IMPMAL.ConditionOverburdened"
        },
        {
            icon: "systems/whtow/assets/icons/conditions/poisoned.svg",
            id: "poisoned",
            statuses : ["poisoned"],
            name: "IMPMAL.ConditionPoisoned",
            title: "IMPMAL.ConditionPoisoned"
        },
        {
            icon: "systems/whtow/assets/icons/conditions/prone.svg",
            id: "prone",
            statuses : ["prone"],
            name: "IMPMAL.ConditionProne",
            title: "IMPMAL.ConditionProne"
        },
        {
            icon: "systems/whtow/assets/icons/conditions/restrained.svg",
            id: "restrained",
            statuses : ["restrained"],
            name: "IMPMAL.ConditionRestrained",
            title: "IMPMAL.ConditionRestrained"
        },
        {
            icon: "systems/whtow/assets/icons/conditions/stunned.svg",
            id: "stunned",
            statuses : ["stunned"],
            name: "IMPMAL.ConditionStunned",
            title: "IMPMAL.ConditionStunned",
        },
        {
            icon: "systems/whtow/assets/icons/conditions/unconscious.svg",
            id: "unconscious",
            statuses : ["unconscious"],
            name: "IMPMAL.ConditionUnconscious",
            title: "IMPMAL.ConditionUnconscious",
        },
        {
            icon: "systems/whtow/assets/icons/conditions/dead.svg",
            id: "dead",
            statuses : ["dead"],
            name: "IMPMAL.Dead",
            title: "IMPMAL.Dead",
        },
    ]
};


CONFIG.TextEditor.enrichers = CONFIG.TextEditor.enrichers.concat([
    // {
    //     pattern : /@TableHTML\[(.+?)\](?:{(.+?)})?/gm,
    //     enricher : async (match) => 
    //     {
    //         let table = await fromUuid(match[1]);
    //         let options = match[2].split(",").map(i => i.trim());
    //         let label = options[0];
    //         if (table)
    //         {
    //             return $(await ImpMalUtility.tableToHTML(table, label, options))[0];
    //         }
    //         else 
    //         {
    //             return `Error - Table ${match[0]} not Found`;
    //         }
    //     }
    // }
]);

foundry.utils.mergeObject(OLDWORLD, defaultWarhammerConfig)
export {OLDWORLD, TOW_CONFIG};