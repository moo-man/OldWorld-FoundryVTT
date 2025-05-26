import TestDialog from "../apps/test-dialog/test-dialog";
import WeaponDialog from "../apps/test-dialog/weapon-dialog";
import { OldWorldTest } from "../system/tests/test";
import { WeaponTest } from "../system/tests/weapon";
import OldWorldDocumentMixin from "./mixin";

export class OldWorldActor extends OldWorldDocumentMixin(WarhammerActor)
{
    clearOpposed()
    {
        return this.update({"flags.whtow.-=opposed" : null});
    }


    async setupSkillTest(skill, context, options)
    {
        await this._setupTest(TestDialog, OldWorldTest, skill, context, options)
    }

    async setupWeaponTest(weapon, context, options)
    {
        await this._setupTest(WeaponDialog, WeaponTest, weapon,  context, options)
    }
}