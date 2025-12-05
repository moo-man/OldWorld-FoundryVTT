import TableSettings from "../apps/table-settings";
import OldWorldThemeConfig from "../apps/theme";

export default function registerSettings() 
{
    game.settings.register("whtow", "systemMigrationVersion", {
        name: "System Migration Version",
        scope: "world",
        config: false,
        type: String,
        default: "0.0.0"
    });
        

    game.settings.registerMenu("whtow", "themeConfig", {
        name: "WH.Theme.Config",
        label : "WH.Theme.ConfigButton",
        hint : "WH.Theme.ConfigHint",
        icon: "fa-solid fa-table-layout",
        scope: "user",
        config: true,
        type: OldWorldThemeConfig
      });
  

    game.settings.registerMenu("whtow", "tableSettingsMenu", {
        name : game.i18n.localize("TOW.Setting.TableSettings"),
        label : game.i18n.localize("TOW.Setting.TableConfigure"),
        hint : game.i18n.localize("TOW.Setting.TableSettingsHint"),
        icon : "fa-solid fa-list",
        type : TableSettings,
        restricted : true
    })  ;

    game.settings.register("whtow", "tableSettings", {
        name: "TOW.Setting.TableSettings",
        scope: "world",
        config: false,
        type: TableSettings.schema
    });

    game.settings.register("whtow", "theme", {
        name: "Theme",
        scope: "client",
        config: false,
        type: OldWorldThemeConfig.schema
    });
  

}