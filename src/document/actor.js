import CastingDialog from "../apps/test-dialog/spell-dialog";
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
    async setupSkillTest(skill, context, options)
    {
        return await this._setupTest(TestDialog, OldWorldTest, skill, context, options)
    }

    async setupWeaponTest(weapon, context, options)
    {
        return await this._setupTest(WeaponDialog, WeaponTest, weapon,  context, options)
    }

    async setupCastingTest(spell, context, options)
    {
        return await this._setupTest(CastingDialog, CastingTest, spell, context, options)
    }

    async useItem(item, context={}, options)
    {
        if (typeof item == "string")
        {
            if (item.includes("."))
            {
                item = await fromUuid(item);
            }
            else 
            {
                item = actor.items.get(item);
            }
        }

        context.itemUuid = item.uuid;
        
        if (item.system.test.self && item.system.test.skill)
        {
            this.setupSkillTest(item.system.test.skill, context, options)
        }
        else
        {
            let use = await ItemUse.fromItem(item, this, context);
            use.roll();
            use.sendToChat();
        }
    }

    async useBlessing(type, context={}, options)
    {
        
        let blessing = this.system.blessed.document;
        if (!type || !document)
        {
            return;
        }

        context.itemUuid = blessing.uuid;
        
        let use = await BlessingUse.fromItem(blessing, type, this, context);
        use.roll();
        use.sendToChat();
    }

    async addCondition(condition)
    {
        let owner = warhammer.utility.getActiveDocumentOwner(this);

        if (game.user.id != owner.id)
        {
            await owner.query("addCondition", {uuid: this.uuid, condition})
            return this.hasCondition(condition);
        }

        if (!this.hasCondition(condition))
        {
            this.createEmbeddedDocuments("ActiveEffect", [game.oldworld.config.conditions[condition]], {condition: true})
        }
        else if (this.hasCondition(condition) && condition == "staggered")
        {
           await this.system.promptStaggeredChoice({excludeOptions : this.system.excludeStaggeredOptions});
        }
    }

    async removeCondition(condition)
    {
        let existing = this.hasCondition(condition)
        existing?.delete();
    }
}