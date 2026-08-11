
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
            let message = game.messages.get(li.dataset.messageId);
            return hasTest(li) && (message.isAuthor || message.isOwner)
        };

        options.unshift(
            {
                name: game.i18n.localize("TOW.Test.Reroll"),
                icon: '<i class="fa-solid fa-rotate-right"></i>',
                condition: canEdit,
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
                condition: canEdit,
                callback: li =>
                {
                    let message = game.messages.get(li.dataset.messageId);
                    message.system.test.gloriousReroll();
                }
            },
            {
                name: game.i18n.localize("TOW.Test.RerollGrim"),
                icon: '<i class="fa-solid fa-rotate-right"></i>',
                condition: canEdit,
                callback: li =>
                {
                    let message = game.messages.get(li.dataset.messageId);
                    message.system.test.grimReroll();
                }
            },
            {
                name: game.i18n.localize("TOW.Test.ModifyDice"),
                icon: '<i class="fa-solid fa-dice-d10"></i>',
                condition: canEdit,
                callback: async li =>
                {
                    let value = Number(await ValueDialog.create({text: "Add or Subtract Dice from the Test", title: "Modify Dice"}));
                    let message = game.messages.get(li.dataset.messageId);
                    message.system.test.modifyDice(value);
                }
            },
            {
                name: game.i18n.localize("TOW.Test.AddTargets"),
                icon: '<i class="fa-solid fa-crosshairs"></i>',
                condition: (li) => canEdit(li) && game.user.targets.size > 0,
                callback: li =>
                {
                    if (game.user.isGM)
                    {
                        let message = game.messages.get(li.dataset.messageId);
                        message.system.test.addTargets(Array.from(game.user.targets).map(i => i.document));
                    }
                    else
                    {
                        ui.notifications.error("Adding Targets must be done by the GM.")
                    }
                }
            }
        );
    }
}