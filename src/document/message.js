
export class OldWorldChatMessage extends WarhammerChatMessage 
{
    static addTestContextOptions(options)
    {
        let hasTest = li =>
        {
            let message = game.messages.get(li.dataset.messageId);
            return message.system.test;
        };

        let canEdit = li =>
        {
            return hasTest(li) && game.user.isGM;
        };

        options.unshift(
            {
                name: game.i18n.localize("TOW.Test.Reroll"),
                icon: '<i class="fa-solid fa-rotate-right"></i>',
                condition: hasTest,
                callback: li =>
                {
                    let message = game.messages.get(li.dataset.messageId);
                    let dice = Array.from(li.querySelectorAll(".selected")).map((e) => Number(e.dataset.index));
                    message.system.test.reroll(null, dice, true);
                }
            },
            {
                name: game.i18n.localize("TOW.Test.RerollGlorious"),
                icon: '<i class="fa-solid fa-rotate-right"></i>',
                condition: hasTest,
                callback: li =>
                {
                    let message = game.messages.get(li.dataset.messageId);
                    message.system.test.gloriousReroll();
                }
            },
            {
                name: game.i18n.localize("TOW.Test.RerollGrim"),
                icon: '<i class="fa-solid fa-rotate-right"></i>',
                condition: hasTest,
                callback: li =>
                {
                    let message = game.messages.get(li.dataset.messageId);
                    message.system.test.grimReroll();
                }
            }
        );
    }
}