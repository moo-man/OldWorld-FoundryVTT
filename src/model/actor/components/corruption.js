let fields = foundry.data.fields;

export class CorruptionDataModel extends SingletonItemModel {
    static defineSchema() {
        let schema = super.defineSchema();
        schema.state = new fields.StringField({ initial: "none" })
        schema.temptation = new fields.StringField()
        // "none" - neither vulnerable, nor failed corruption test
        // "vulnerable" - failed corruption test, is vulnerable, has not been tempted
        // "refused" - Refused temptation
        // "accepted" - accepted temptation, is now tarnished/tainted/damned
        return schema;
    }

    get level() {
        return this.document?.system.level || 0
    }

    set(item) {
        // Don't delete if same corruption added
        if (item.name == this.document?.name) {
            this.document.update({ "system.level": this.document.system.level + 1 })
            return;
        }
        else return super.set(item);
    }

    async promptCorruptionTest() {
        let actor = this.parent.parent;
        let test = await actor.setupSkillTest("willpower", { corruption: true, appendTitle : ` - Corruption`, fields: { rollMode: "gmroll" } });

        if (test.failed && ["none", "refused"].includes(this.state)) {
            actor.update({ "system.corruption.state": "vulnerable" })
        }
    }

    async offerTemptation() {
        await foundry.applications.api.Dialog.wait({
            window: { title: "TOW.Dialog.Temptation", resizable: true },
            classes: ["temptation", "warhammer", "whtow"],
            position: {
                height: 300
            },
            content: `
            <div class="flexrow">
                <div class="flexcol">
                    <p class="centered">What they will receive...</p>
                    <textarea name="offering"></textarea>
                </div>
        
                <div class="flexcol">
                    <p class="centered">What they must do...</p>
                    <textarea name="price"></textarea>
                </div>
            </div>`,
            buttons: [
                {
                    action: "offer",
                    label: "TOW.Dialog.Offer",
                    callback: (event, button, dialog) => {
                        let offering = button.form.elements.offering.value;
                        let price = button.form.elements.price.value;
                        let actor = this.parent.parent;
                        actor.update({"system.corruption.temptation" : `<p><strong>Offering</strong>: <em>${offering}</em></p><p><strong>Price</strong>: <em>${price}</em></p>`})
                        let owner = warhammer.utility.getActiveDocumentOwner(actor);
                        if (owner)
                        {
                            owner.query("offerTemptation", {offering, price, uuid : actor.uuid});
                        }
                    }
                }
            ]
        })
    }

    async receiveTemptation({ offering, price }) {
        let actor = this.parent.parent
        let answered = await foundry.applications.api.Dialog.wait({
            window: { title: "TOW.Dialog.AnOffering", resizable: true },
            position: {
                height: 500,
                width: 600
            },
            classes: ["temptation", "warhammer", "whtow"],
            resolveClose: true,
            content: `
            <div class="flexrow">
                <div class="flexcol">
                    <p class="centered">What you will receive...</p>
                    <textarea disabled name="offering">${offering}</textarea>
                </div>
        
                <div class="flexcol">
                    <p class="centered">What you must do...</p>
                    <textarea disabled name="price">${price}</textarea>
                </div>
            </div>`,
            buttons: [
                {
                    action: "accept",
                    label: "TOW.Dialog.Accept",
                    callback: async () => {
                        await actor.update({"system.corruption.state" : "accepted"})
                        this.document?.update({"system.level" : this.document.system.level + 1});
                    }
                },
                {
                    action: "refuse",
                    label: "TOW.Dialog.Refuse",
                    callback: () => {
                        actor.update({"system.corruption.state" : "refused"})
                    }
                }
            ]

        })

        if (!answered)
        {
            actor.update({"system.corruption.state" : "refused"})
        }
    }
}