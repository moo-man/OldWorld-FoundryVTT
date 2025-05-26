let fields = foundry.data.fields;

export class OldWorldAvoidTestModel extends AvoidTestModel {
    static defineSchema() {
        let schema = super.defineSchema();
        schema.difficulty = new fields.StringField({});
        schema.characteristic = new fields.StringField({});
        schema.skill = new fields.StringField({});

        return schema;
    }
}

export class OldWorldActiveEffectModel extends WarhammerActiveEffectModel {
    static _avoidTestModel = OldWorldAvoidTestModel;

    static defineSchema()
    {
        let schema = super.defineSchema();
        schema.computed = new fields.BooleanField({initial: false})
        return schema
    }
}   