
import chat from "./hooks/chat";


export default function() 
{
    chat();


    Hooks.on("hotbarDrop", (hotbar, data, pos) => 
    {
        if (data.type == "Item")
        {
            game.oldworld.utility.createMacro(data, pos);
            return false;
        }
    });
}