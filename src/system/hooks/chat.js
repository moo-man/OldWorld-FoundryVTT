import { OldWorldChatMessage } from "../../document/message";

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
}