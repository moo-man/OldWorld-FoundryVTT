import { PostedItemMessageModel } from "../model/message/item";
import OldWorldDocumentMixin from "./mixin";

export class OldWorldItem extends OldWorldDocumentMixin(WarhammerItem)
{
    async addCondition(condition) {
        if (!this.hasCondition(condition)) {
            this.createEmbeddedDocuments("ActiveEffect", [game.oldworld.config.conditions[condition]], { condition: true })
        }
    }

    async removeCondition(condition) {
        this.hasCondition(condition)?.delete();
    }

    post(chatData)
    {
        PostedItemMessageModel.postItem(this, chatData)
    }
}