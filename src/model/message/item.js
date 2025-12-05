
export class PostedItemMessageModel extends WarhammerMessageModel
{
    static defineSchema() 
    {
        let fields = foundry.data.fields;
        let schema = {};
        schema.itemData = new fields.ObjectField({});
        return schema;
    }

    static async postItem(item, chatData={})
    {
        let summary = await foundry.applications.handlebars.renderTemplate("systems/whtow/templates/chat/item-summary.hbs", foundry.utils.mergeObject(await item.system.summaryData(), {expanded: true}));
        let content = await foundry.applications.handlebars.renderTemplate("systems/whtow/templates/chat/item-post.hbs", {name : item.name, img : item.img, summary, item});
        ChatMessage.create(foundry.utils.mergeObject({
            content,
            type : "item",
            system : {
                itemData : item.toObject()
            }
        }, chatData));
    }

    static get actions() 
    { 
        return foundry.utils.mergeObject(super.actions, {
            buyItem :  this._onBuyItem,
            expandItem : this._onExpandItem,
    });
    }

    async onRender(html) {

        let post = html.querySelector(".item-drag")
        if (post)
        {
            post.draggable = true;
            post.addEventListener("dragstart", ev => {
                ev.dataTransfer.setData("text/plain", JSON.stringify({ type: "Item", data: this.itemData }));
            })
        }
    }

    static _onBuyItem(ev, target)
    {
        for(let actor of selectedWithFallback())
        {
            this.buyItem(actor);
        }
    }

    buyItem(actor)
    {
        return this.constructor.buy(actor, this.itemData);
    }

    static async buy(actor, itemData)
    {
        if (!actor)
        {
            ui.notifications.error("TOW.Error.NoActorBuyItem", {localize: true});
        }
        if ((actor.system.coins[itemData.system.cost] > 0))
        {
            let confirm = await foundry.applications.api.Dialog.confirm({
                window : {title : `${actor.name}`},
                content : `<p>Buy <strong>${itemData.name}</strong> (${game.oldworld.config.status[itemData.system.cost]})?</p>`
            })

            if (confirm)
            {
                ChatMessage.create({content : game.i18n.format("TOW.Chat.BuySuccessful", {item : itemData.name, cost : game.oldworld.config.status[itemData.system.cost]}), speaker : {alias : actor.name}})
                await actor.update({[`system.coins.${itemData.system.cost}`] : actor.system.coins[itemData.system.cost] - 1});
                await Item.implementation.create(itemData, {parent : actor});
            }
        }
        else
        {
            ui.notifications.error(game.i18n.format("TOW.Error.NoCoin", {name : actor.name}));
        }
    }

    static _onExpandItem(ev, target) {
        target.parentElement.querySelector(".description").classList.toggle("expanded");
    }



    get item()
    {
        return new Item.implementation(this.itemData);
    }
}