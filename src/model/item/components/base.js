let fields = foundry.data.fields;
export class BaseItemModel extends BaseWarhammerItemModel 
{
    static defineSchema() 
    {
        let schema = {};
        schema.description = new fields.SchemaField({
            public : new fields.StringField(),
            gm : new fields.StringField()
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