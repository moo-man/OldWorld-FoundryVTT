import { XPMessageModel } from "../../model/message/xp.js";


/**
 *
 */
export default function () 
{
    /**
     * Init function loads tables, registers settings, and loads templates
     */
    Hooks.once("init", () => 
    {
        game.oldworld.commands = new ChatCommands({
            table : {
                description: "Roll on a table",
                args : ["table", "modifier", "column"],
                defaultArg : "table",
                examples : "<br><span font-family:'monospaced'</span>/table critarm</span><br><span font-family:'monospaced'</span>/table mutatephys modifier=20 column=khorne</span>",
                callback: (table, modifier, column) => OldWorldTables.handleTableCommand(table, {modifier, column})
            },
            corruption : {
                description : "Prompt Corruption Test",
                args : ["strength", "skill", "source"],
                defaultArg : "strength",
                callback: (strength, skill, source) => 
                {
                    CorruptionMessageModel.handleCorruptionCommand(strength, skill, source);
                }
            },
            xp : {
                description : "Prompt XP Reward",
                args : ["amount", "reason"],
                defaultArg : "amount",
                callback: (amount, reason) => 
                {
                    XPMessageModel.handleXPCommand(amount, reason);
                }
            }
        });
    });
}