import TestDialog from "../apps/test-dialog/test-dialog";
import WeaponDialog from "../apps/test-dialog/weapon-dialog";
import { OldWorldTest } from "../system/tests/test";
import { WeaponTest } from "../system/tests/weapon";
import OldWorldDocumentMixin from "./mixin";

export class OldWorldActor extends OldWorldDocumentMixin(WarhammerActor)
{
    async setupSkillTest(skill, context, options)
    {
        await this._setupTest(TestDialog, OldWorldTest, skill, context, options)
    }

    async setupWeaponTest(weapon, context, options)
    {
        await this._setupTest(WeaponDialog, WeaponTest, weapon,  context, options)
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