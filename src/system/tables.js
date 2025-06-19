export default class OldWorldTables 
{
    static async rollTable(key, formula, {showRoll=true}={})
    {
        let id = game.settings.get("whtow", "tableSettings")[key];
        let table = game.tables.get(id);

        if (!table && !formula)
        {
            let error = "No table found for " + key + ". Check Table Settings within System Settings";
            ui.notifications.error(error);
            throw new Error(error);
        }

        let dice = formula ? new Roll(formula) : new Roll(table?.formula);

        if (!table)
        {
            ui.notifications.error("No table found for " + key);
            return dice.toMessage();
        }

        await dice.roll();

        if (showRoll)
        {
            let msg = await dice.toMessage({flavor : table?.name, speaker : ChatMessage.getSpeaker()});
            if (game.dice3d)
            {
                await game.dice3d.waitFor3DAnimationByMessageID(msg.id);
            }
        }

        if (table)
        {
            let maxRoll = Math.max(...table.results.contents.map(r => r.range[1]));

            let roll = Math.min(maxRoll, dice.total);

            let result = table.getResultsForRoll(roll)[0];

            if (result)
            {
                let document = await fromUuid(result.documentUuid);
                if (document) // Assumed item
                {
                    document.postItem();
                }
                else 
                {
                    table.draw({results : [result]}); // Display result to chat 
                }
            }
            return result;
        }
    }
}