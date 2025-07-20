
import chat from "./hooks/chat";
import commands from "./hooks/commands";


export default function() 
{
    chat();
    commands();


    Hooks.on("hotbarDrop", (hotbar, data, pos) => 
    {
        if (data.type == "Item")
        {
            game.oldworld.utility.createMacro(data, pos);
            return false;
        }
    });
}