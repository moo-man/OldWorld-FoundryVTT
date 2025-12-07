let fields = foundry.data.fields;
export class BaseItemModel extends BaseWarhammerItemModel 
{
    static defineSchema() 
    {
        let schema = {};
        schema.description = new fields.SchemaField({
            public : new fields.HTMLField(),
            gm : new fields.HTMLField()
        })
        return schema;
    }
    
    /**
     * Used by sheet dropdowns, posting to chat, and test details
     */
    async summaryData()
    {
        let item = this.parent;
        let enriched = {
            public : await foundry.applications.ux.TextEditor.enrichHTML(item.system.description.public, {async: true, relativeTo: item, secrets : false}),
            gm : await foundry.applications.ux.TextEditor.enrichHTML(item.system.description.gm, {async: true, relativeTo: item, secrets : false})
        }

        return {noImage : ["icons/svg/item-bag.svg", "modules/warhammer-lib/assets/blank.png"].includes(item.img), enriched, item }
    }

    
    computeOwned(actor) 
    {
        super.computeOwned(actor);
        actor.runScripts("computeOwnedItem", {item: this.parent, actor})
    }
}