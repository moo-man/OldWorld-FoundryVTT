export default class MountConfig extends DraggableApp(WHFormApplication)
{
    static DEFAULT_OPTIONS = {
        tag: "form",
        classes: ["whtow","warhammer", "mount-config"],
        window: {
            title: "TOW.MountConfig",
            contentClasses : ["standard-form"],
            resizable : true,
        },
        position : {
            width: 250,
            height: 300
        },
        dragDrop: [{ dragSelector: null, dropSelector: ".window-content" }],
        actions : {
            listDelete: this._onListDelete
        }
    }

    /** @override */
    static PARTS = {
        form: {
            template: "systems/whtow/templates/apps/mount-config.hbs",
            scrollable: [""],
            classes: ["standard-form"]
        }
    };

    async _prepareContext(options) {
        let context = await super._prepareContext(options);
        context.mountData = this.document.system.mountData;
        return context;
    }

    async _onDropItem(data, ev)
    {
        let item = await  Item.implementation.fromDropData(data);

        if (item.parent?.uuid != this.document.uuid)
        {
            return ui.notifications.error("Items must be owned by the mount Actor")
        }

        await this.document.update(this.document.system.mountData.items.add(item));
        this.render({force: true})
    }

    async _onDropActiveEffect(data, ev)
    {
        let effect =  await Item.implementation.fromDropData(data);
        await this.document.update(this.document.system.mountData.effects.add(effect));
        this.render({force: true})
    }

    static async _onListDelete(ev, target)
    {
        let list = foundry.utils.getProperty(this.document, target.dataset.path);
        let index = Number(target.closest("[data-index]").dataset.index);

        await this.document.update(list.remove(index));

        this.render({force: true});
    }


}