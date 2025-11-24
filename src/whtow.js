import { OldWorldActor } from "./document/actor";
import { OldWorldEffect } from "./document/effect";
import { OldWorldItem } from "./document/item";
import { CharacterModel } from "./model/actor/character";
import { WeaponModel } from "./model/item/weapon";
import ActorSheetOldWorldCharacter from "./sheet/actor/character-sheet";
import WeaponSheet from "./sheet/item/types/weapon-sheet";
import { OLDWORLD, TOW_CONFIG } from "./system/config";
import registerHooks from "./system/hooks";
import registerHandlebars from "./system/handlebars";
import { TalentModel } from "./model/item/talent";
import TalentSheet from "./sheet/item/types/talent-sheet";
import LoreSheet from "./sheet/item/types/lore-sheet";
import { LoreModel } from "./model/item/lore";
import OriginSheet from "./sheet/item/types/origin-sheet";
import { OriginModel } from "./model/item/origin";
import { BlessingModel } from "./model/item/blessing";
import { ToolKitModel } from "./model/item/toolKit";
import { SpellModel } from "./model/item/spell";
import { WoundModel } from "./model/item/wound";
import { TrappingModel } from "./model/item/trapping";
import { CareerModel } from "./model/item/career";
import { ArmourModel } from "./model/item/armour";
import { AssetModel } from "./model/item/asset";
import ArmourSheet from "./sheet/item/types/armour-sheet";
import AssetSheet from "./sheet/item/types/asset-sheet";
import BlessingSheet from "./sheet/item/types/blessing-sheet";
import CareerSheet from "./sheet/item/types/career-sheet";
import SpellSheet from "./sheet/item/types/spell-sheet";
import ToolKitSheet from "./sheet/item/types/toolKit-sheet";
import TrappingSheet from "./sheet/item/types/trapping-sheet";
import WoundSheet from "./sheet/item/types/wound-sheet";
import { OldWorldChatMessage } from "./document/message";
import { OldWorldTest } from "./system/tests/test";
import { OldWorldTestMessageModel } from "./model/message/test";
import { OldWorldActiveEffectModel } from "./model/effect/effect";
import OldWorldActiveEffectConfig from "./sheet/effect";
import { WeaponTest } from "./system/tests/weapon";
import { OldWorldOpposedMessageModel } from "./model/message/opposed";
import registerSettings from "./system/settings";
import { NPCModel } from "./model/actor/npc";
import OldWorldTables from "./system/tables";
import { CastingTest } from "./system/tests/cast";
import { ItemUse } from "./system/tests/item-use";
import CorruptionSheet from "./sheet/item/types/corruption-sheet";
import { CorruptionModel } from "./model/item/corruption";
import ActorSheetOldWorldNPC from "./sheet/actor/npc-sheet";
import { AbilityModel } from "./model/item/ability";
import AbilitySheet from "./sheet/item/types/ability-sheet";
import { XPMessageModel } from "./model/message/xp";

Hooks.once("init", () => 
{

    // #if _ENV == "development"
    CONFIG.debug["whtow"] = true;
    // debug();
    // #endif
    
    CONFIG.Actor.documentClass = OldWorldActor;
    CONFIG.Item.documentClass = OldWorldItem;
    CONFIG.ActiveEffect.documentClass = OldWorldEffect;
    CONFIG.ChatMessage.documentClass = OldWorldChatMessage;
    CONFIG.RollTable.documentClass = WarhammerRollTable;


    Actors.registerSheet("whtow", ActorSheetOldWorldCharacter, { types: ["character"], makeDefault: true });
    Actors.registerSheet("whtow", ActorSheetOldWorldNPC, { types: ["npc"], makeDefault: true });
    // Actors.registerSheet("whtow", ActorSheetOldWorldVehicle, { types: ["vehicle"], makeDefault: true });

    Items.registerSheet("whtow", WeaponSheet, {types : ["weapon"], makeDefault: true });
    Items.registerSheet("whtow", TalentSheet, {types : ["talent"], makeDefault: true });
    Items.registerSheet("whtow", LoreSheet, {types : ["lore"], makeDefault: true });
    Items.registerSheet("whtow", OriginSheet, {types : ["origin"], makeDefault: true });
    Items.registerSheet("whtow", ArmourSheet, {types : ["armour"], makeDefault: true });
    Items.registerSheet("whtow", AssetSheet, {types : ["asset"], makeDefault: true });
    Items.registerSheet("whtow", BlessingSheet, {types : ["blessing"], makeDefault: true });
    Items.registerSheet("whtow", CareerSheet, {types : ["career"], makeDefault: true });
    Items.registerSheet("whtow", SpellSheet, {types : ["spell"], makeDefault: true });
    Items.registerSheet("whtow", ToolKitSheet, {types : ["toolKit"], makeDefault: true });
    Items.registerSheet("whtow", TrappingSheet, {types : ["trapping"], makeDefault: true });
    Items.registerSheet("whtow", WoundSheet, {types : ["wound"], makeDefault: true });
    Items.registerSheet("whtow", CorruptionSheet, {types : ["corruption"], makeDefault: true });
    Items.registerSheet("whtow", AbilitySheet, {types : ["ability"], makeDefault: true });
    // Items.registerSheet("whtow", ProtectionItemSheet, { types: ["protection"], makeDefault: true });

    DocumentSheetConfig.registerSheet(ActiveEffect, "whtow", OldWorldActiveEffectConfig, {makeDefault : true});

    CONFIG.Actor.dataModels["character"] = CharacterModel;
    CONFIG.Actor.dataModels["npc"] = NPCModel;

    CONFIG.Item.dataModels["weapon"] = WeaponModel;
    CONFIG.Item.dataModels["talent"] = TalentModel;
    CONFIG.Item.dataModels["lore"] = LoreModel;
    CONFIG.Item.dataModels["origin"] = OriginModel;
    CONFIG.Item.dataModels["blessing"] = BlessingModel;
    CONFIG.Item.dataModels["toolKit"] = ToolKitModel;
    CONFIG.Item.dataModels["tool"] = ToolKitModel;
    CONFIG.Item.dataModels["spell"] = SpellModel;
    CONFIG.Item.dataModels["wound"] = WoundModel;
    CONFIG.Item.dataModels["trapping"] = TrappingModel;
    CONFIG.Item.dataModels["career"] = CareerModel;
    CONFIG.Item.dataModels["armour"] = ArmourModel;
    CONFIG.Item.dataModels["asset"] = AssetModel;
    CONFIG.Item.dataModels["corruption"] = CorruptionModel;
    CONFIG.Item.dataModels["ability"] = AbilityModel;

    CONFIG.ActiveEffect.dataModels["base"] = OldWorldActiveEffectModel
    CONFIG.ChatMessage.dataModels["test"] = OldWorldTestMessageModel;
    CONFIG.ChatMessage.dataModels["opposed"] = OldWorldOpposedMessageModel;
    CONFIG.ChatMessage.dataModels["xp"] = XPMessageModel;

    game.oldworld = {
        config : OLDWORLD,
        // utility : OldWorldUtility,
        tables : OldWorldTables,
        // migration : Migration,
        // testClasses : {

        // },
    };

    game.oldworld.config.rollClasses = {
        "OldWorldTest" : OldWorldTest,
        "WeaponTest" : WeaponTest,
        "CastingTest" : CastingTest,
        "ItemUse" : ItemUse
    }

    CONFIG.queries.addCondition = async (data) => {
        let actor = await fromUuid(data.uuid);
        if (actor)
        {
            actor.addCondition(data.condition);
        }
    }

    CONFIG.queries.updateUnopposed = async (data) => {
        let message = game.messages.get(data.id);
        if (message?.system)
        {
            message.system.setUnopposed()
        }

        let actor = await fromUuid(data.uuid);

        actor.system.clearOpposed();
    }

    CONFIG.queries.updateAppliedDamage = async (data) => {
        let message = game.messages.get(data.id);
        if (message?.system)
        {
            message.system.updateAppliedDamage(data.message)
        }
    }

    CONFIG.queries.offerTemptation = async (data) => {
        fromUuid(data.uuid).then(actor => actor.system.corruption.receiveTemptation(data));
    }


    CONFIG.fontDefinitions.CaslonPro = {editor : true, fonts : []}

    CONFIG.canvasTextStyle = new PIXI.TextStyle({
      fontFamily: "CaslonPro",
      fontSize: 36,
      fill: "#FFFFFF",
      stroke: '#111111',
      strokeThickness: 1,
      dropShadow: true,
      dropShadowColor: "#000000",
      dropShadowBlur: 4,
      dropShadowAngle: 0,
      dropShadowDistance: 0,
      align: "center",
      wordWrap: false
    })

    registerSettings();
    registerHandlebars();
    
    foundry.utils.mergeObject(CONFIG, TOW_CONFIG);

});

// FoundryOverrides();
registerHooks();
// loadScripts();
// tokenHelpers()