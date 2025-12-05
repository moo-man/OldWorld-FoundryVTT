import OldWorldThemeConfig from "../../apps/theme";

export default function() {
    Hooks.on("ready", () => {
        OldWorldThemeConfig.setTheme();
    })
}