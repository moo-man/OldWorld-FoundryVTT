import TestDialog from "../apps/test-dialog/test-dialog";
import OldWorldDocumentMixin from "./mixin";

export class OldWorldActor extends OldWorldDocumentMixin(WarhammerActor)
{
    clearOpposed()
    {
        return this.update({"flags.whtow.-=opposed" : null});
    }


    async setupSkillTest(skill, context, options)
    {
        this._setupTest(TestDialog, null, skill, context, options)
    }
}