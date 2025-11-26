import { OldWorldChatMessage } from "../../document/message";

export default function()
{
    Hooks.on("createToken", (token, options, user) =>
    {
        if (game.user.id == user)
        {
            if (token.actor?.system.hasChoices)
            {
                token.actor.system.makeChoices()
            }
        }
    });
}