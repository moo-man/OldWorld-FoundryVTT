
import chat from "./hooks/chat";
import commands from "./hooks/commands";
import init from "./hooks/init";
import ready from "./hooks/ready";
import token from "./hooks/token";


export default function() 
{
    init();
    chat();
    commands();
    token();
    ready();

    Hooks.on("hotbarDrop", (hotbar, data, pos) => 
    {
        if (data.type == "Item")
        {
            game.oldworld.utility.createMacro(data, pos);
            return false;
        }
    });
}