let fields = foundry.data.fields;

export class MountDataModel extends DocumentReferenceModel 
{
    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.dismounted = new fields.BooleanField()
        return schema;
    }

    get isMounted()
    {
        return !!this.document && !this.dismounted
    }

    get hasMount()
    {
        return !!this.document;
    }

    get items()
    {
        return this.document.system.mountData.items.documents
    }
}