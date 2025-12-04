// This entire class is because there's absolutely no way to get fixed positioning on chat message context menus (WHY IS FIXED PRIVATE???)
// That's only necessary because the styling adds a filter: dropshadow to the messages, which screws up the z-ordering (https://stackoverflow.com/questions/74663883/css-filter-making-element-dissapear)

export class OldWorldContextMenu extends WarhammerContextMenu
{

    constructor(container, selector, menuItems, {eventName="contextmenu", onOpen, onClose, jQuery, fixed=false}={})
    {
        if (selector == ".message[data-message-id]")
        {
            fixed = true;
        }
        super(container, selector, menuItems, {eventName, onOpen, onClose, jQuery, fixed});
    }
}
