
export default function registerHandlebars() 
{
    // Handlebars.registerHelper("", function (args) 
    // {

    // });


    loadTemplates({
        itemDamage : "systems/whtow/templates/partials/item-damage.hbs",
        listEffect : "systems/whtow/templates/partials/list-effect.hbs",
        itemTest : "systems/whtow/templates/partials/test-data.hbs",
        defendingAgainst : "systems/whtow/templates/partials/defending-against.hbs"
    });
}