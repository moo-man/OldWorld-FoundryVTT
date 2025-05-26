import { OldWorldChatMessage } from "../chat-message";

export default function()
{
    /**
 * Add right click option to damage chat cards to allow application of damage
 * Add right click option to use fortune point on own rolls
 */
    Hooks.on("getChatMessageContextOptions", (html, options) =>
    {
        OldWorldChatMessage.addTestContextOptions(options);
    });

    // Hooks.on("renderChatLog", (app, html) => 
    // {
    //     ImpMalChatMessage.chatListeners(html);
    //     ChatHelpers.addOpposedHighlightListeners(html);
    // });

    // Hooks.on("renderChatMessage", (app, html) => 
    // {
    //     ImpMalItem.itemPostListeners(html);
    //     ChatHelpers.removeGMOnlyElements(html);
    //     if (!app.isAuthor && !app.isOwner)
    //     {
    //         ChatHelpers.removeNonOwnerElements(html);
    //     }
    // });
}