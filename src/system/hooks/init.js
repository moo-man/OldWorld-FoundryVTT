import { OldWorldContextMenu } from "../context-menu";

export default function()
{
    Hooks.on("init", (html, options) =>
    {
        CONFIG.ux.ContextMenu = OldWorldContextMenu;
    });
}