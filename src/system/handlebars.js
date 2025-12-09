
export default function registerHandlebars() 
{
    foundry.applications.handlebars.loadTemplates({
        itemDamage : "systems/whtow/templates/partials/item-damage.hbs",
        listEffect : "systems/whtow/templates/partials/list-effect.hbs",
        itemTest : "systems/whtow/templates/partials/test-data.hbs",
        defendingAgainst : "systems/whtow/templates/partials/defending-against.hbs",
        staggeredOptions : "systems/whtow/templates/partials/stagger-options.hbs",
        mountSection : "systems/whtow/templates/partials/mount-section.hbs"
    });
}