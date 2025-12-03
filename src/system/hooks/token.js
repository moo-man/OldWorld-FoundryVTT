import { OldWorldChatMessage } from "../../document/message";

export default function()
{
    Hooks.on("createToken", async (token, options, user) =>
    {
        if (game.user.id == user)
        {
            let actor = token.actor
            if (!actor.system.mount.isMounted)
            {
                return
            }

            if ( !game.user.can("TOKEN_CREATE") ) {
                return ui.notifications.error(`You do not have permission to create Token for mount (${actor.system.mount.document.name}). The GM must either configure thosee permissions or place the rider Actor themselves.`);
            }


            const mountToken = await actor.system.mount.document.getTokenDocument({
                hidden: token.hidden,
                sort: token.sort - 1,
                width: Math.max(actor.prototypeToken.width, token.width + 1),
                height: Math.max(actor.prototypeToken.height, token.height + 1),
                x : token.x,
                y : token.y
              }, {parent: canvas.scene});
          
              await mountToken.constructor.create(mountToken, {parent: canvas.scene}).then(t => {
                token.update({"flags.whtow.mountId" : t.id})
              })
        }
    });

    Hooks.on("updateToken", async (token, data, options, user) =>
        {
            if (game.user.id == user)
            {
                let actor = token.actor
                if (!actor.system.mount.isMounted)
                {
                    return
                }

                let mountToken = token.parent.tokens.get(token.getFlag("whtow", "mountId"))

                if (mountToken)
                {
                    mountToken.update({x: data.x || token.x, y: data.y || token.y})
                }
            }
        });
}