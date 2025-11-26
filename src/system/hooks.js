
import chat from "./hooks/chat";
import commands from "./hooks/commands";
import token from "./hooks/token";


export default function() 
{
    chat();
    commands();
    token();


    Hooks.on("hotbarDrop", (hotbar, data, pos) => 
    {
        if (data.type == "Item")
        {
            game.oldworld.utility.createMacro(data, pos);
            return false;
        }
    });
}