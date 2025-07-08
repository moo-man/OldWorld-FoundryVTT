let fields = foundry.data.fields;

export class BlessedDataModel extends SingletonItemModel 
{
    static defineSchema() 
    {
        let schema = super.defineSchema();
        return schema;
    }

    get level()
    {
        return this.document?.system.level || 0
    }

    set(item)
    {
        // Don't delete if same blessing added
        if (item.name == this.document?.name)
        {
            this.document.update({"system.level" : this.document.system.level + 1})
            return;
        }
        else return super.set(item);
    }
}