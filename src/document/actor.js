import CastingDialog from "../apps/test-dialog/cast-dialog";
import TestDialog from "../apps/test-dialog/test-dialog";
import WeaponDialog from "../apps/test-dialog/weapon-dialog";
import { BlessingUse } from "../system/tests/blessing-use";
import { CastingTest } from "../system/tests/cast";
import { ItemUse } from "../system/tests/item-use";
import { OldWorldTest } from "../system/tests/test";
import { WeaponTest } from "../system/tests/weapon";
import OldWorldDocumentMixin from "./mixin";

export class OldWorldActor extends OldWorldDocumentMixin(WarhammerActor)
{
    async setupSkillTest(skill, context, options) {
        return await this._setupTest(TestDialog, OldWorldTest, skill, context, options)
    }

    async setupWeaponTest(weapon, context, options) {
        return await this._setupTest(WeaponDialog, WeaponTest, weapon, context, options)
    }

    async setupCastingTest(data, context, options) {
        return await this._setupTest(CastingDialog, CastingTest, data, context, options)
    }

    async useItem(item, context = {}, options) {
        if (typeof item == "string") {
            if (item.includes(".")) {
                item = await fromUuid(item);
            }
            else {
                item = actor.items.get(item);
            }
        }

        context.itemUuid = item.uuid;

        if (item.system.test.self && item.system.test.skill) {
            this.setupSkillTest(item.system.test.skill, context, options)
        }
        else {
            let use = await ItemUse.fromItem(item, this, context);
            use.roll();
            use.sendToChat();
        }
    }

    async useBlessing(type, context = {}, options) {

        let blessing = this.system.blessed.document;
        if (!type || !document) {
            return;
        }

        context.itemUuid = blessing.uuid;

        let use = await BlessingUse.fromItem(blessing, type, this, context);
        use.roll();
        use.sendToChat();
    }

    
    async setupTestFromItem(item, context={}, options)
    {
        if (typeof item == "string")
        {
            if (item.includes("."))
            {
                item = await fromUuid(item);
            }
            else
            {
                item = this.items.get(item); // Maybe uuid is actually simple id
            }
        }
        if (!item)
        {
            return ui.notifications.error("No Item found!");
        }

        let itemTestData = item.system.test;

        context.appendTitle = ` - ${item.name}`;

        return this.setupTestFromData(itemTestData, context, options);
    }

    
    async setupTestFromData(data, context={}, options)
    {
        let skill = data.skill;
        let dice = data.dice || 0;

        if (!context.fields)
        {
            context.fields = {}
        }

        if (dice > 0)
        {
            context.fields.bonus = dice; 
        }
        else if (dice < 0)
        {
            context.fields.penalty = dice;
        }

        return this.setupSkillTest(skill, context, options);
    }

    async addCondition(condition) {
        let owner = warhammer.utility.getActiveDocumentOwner(this);

        if (game.user.id != owner.id) {
            await owner.query("addCondition", { uuid: this.uuid, condition })
            return this.hasCondition(condition);
        }

        if (!this.hasCondition(condition)) {
            return this.createEmbeddedDocuments("ActiveEffect", [game.oldworld.config.conditions[condition]], { condition: true })
        }
        else if (this.hasCondition(condition) && condition == "staggered") {
            return await this.system.promptStaggeredChoice({ excludeOptions: this.system.excludeStaggeredOptions });
        }
    }

    async removeCondition(condition) {
        let existing = this.hasCondition(condition)
        existing?.delete();
    }

    // /** Override to exclude effects if NPC and wound threshold hasn't been met
    //  * 
    //  * @override
    //  * @param {boolean} includeItemEffects Include Effects that are intended to be applied to Items, see getScriptsApplyingToItem, this does NOT mean effects that come from items
    //  * @yields {WarhammerActiveEffect} applicable active effect
    //  */
    // *allApplicableEffects(includeItemEffects = false) 
    // {
    //     let effect = super.allApplicableEffects(includeItemEffects);

    //     if (this.actor.type == "npc" && ["brute", "monstrosity"].includes(this.actor.system.type))
    //     {
    //         if (this.actor.system.effectIsActive(effect))
    //         {
    //             yield effect;
    //         }
    //     }
    //     else 
    //     {
    //         yield effect;
    //     }
    // }
}