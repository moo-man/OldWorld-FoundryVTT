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

    }
}