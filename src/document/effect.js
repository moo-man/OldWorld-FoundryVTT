export class OldWorldEffect extends WarhammerActiveEffect
{

    static CONFIGURATION = {
        zone : true,
        exclude : {},
        bracket : ["(", ")"]
    };

    async resistEffect(skill)
    {
        let result = await super.resistEffect();
        if (result === false || result === true)
        {
            return result;
        }

        let transferData = this.system.transferData;

        let test;
        let context = {appendTitle : " - " + this.name, resist : [this.key].concat(this.sourceTest?.item?.type || []), resistingTest : this.sourceTest, fields: {}};
        if (this.sourceTest && this.sourceTest.result?.test)
        {
            // transferData.avoidTest.dn = this.sourceTest.result.test.dn;
        }
        if (transferData.avoidTest.value == "item")
        {
            test = await this.actor.setupTestFromItem(this.item, context);
        }
        else if (transferData.avoidTest.value == "custom")
        {
            test = await this.actor.setupTestFromData(transferData.avoidTest, context);
        }

        if (!transferData.avoidTest.reversed)
        {
            // If th eavoid test is marked as opposed, it has to win, not just succeed
            if (transferData.avoidTest.opposed && this.sourceTest)
            {
                return test.result.successes >= this.sourceTest.context.potency || this.sourceTest.result.successes;
            }
            else 
            {
                return test.succeeded;
            }
        }
        else  // Reversed - Failure removes the effect
        {
            // If the avoid test is marked as opposed, it has to win, not just succeed
            if (transferData.avoidTest.opposed && this.sourceTest)
            {
                return test.result.successes < this.sourceTest.context.potency || this.sourceTest.result.successes;
            }
            else 
            {
                return test.failed;
            }
        }
    }


    prepareBaseData()
    {
        if (this.parent?.documentName == "Actor" && this.parent.system.hasThresholds)
        {
            if (!this.parent.system.effectIsActive(this))
            {
                this.disabled = true;
            }
        }
    }
        
    get testDisplay() 
    {
        let avoidTest = this.system.transferData.avoidTest;

        if (avoidTest.value == "custom")
        {
            if (avoidTest.skill)
            {
                return game.oldworld.config.skills[avoidTest.skill] + (avoidTest.dice ? ` (${(avoidTest.dice > 0 ? "+" : "")}${avoidTest.dice})` : "")  + " Test"
            }
            else 
            {
                return ""
            }
        }
        else if (avoidTest.value == "item")
        {
            return this.item.system.test.label;
        }
    }

    get changeKeys()
    {
        return {choices: Object.keys(game.oldworld.config.characteristics).map(i => {
            return {
                value: `system.characteristics.${i}.value`,
                label: `${game.oldworld.config.characteristics[i]} (${game.i18n.localize("TOW.Modifier")})`,
                group: "Characteristics"
            }
        }).concat(Object.keys(game.oldworld.config.skills).map(i => {
            return {
                value: `system.skills.${i}.value`,
                label: `${game.oldworld.config.skills[i]} (${game.i18n.localize("TOW.Modifier")})`,
                group: "Skills"
            }
        })).concat([
            {value: "system.resilience.value", label: game.i18n.localize("TOW.Sheet.Resilience"), group: "Other"},
            {value: "system.magic.level", label: game.i18n.localize("TOW.MagicLevel"), group: "Other"},
            {value: "system.speed.value", label: game.i18n.localize("TOW.Sheet.Speed"), group: "Other"},
            {value: "system.speed.modifier", label: game.i18n.localize("TOW.Sheet.SpeedModifier"), group: "Other"},
            {value: "system.excludeStaggeredOptions", label: game.i18n.localize("TOW.Sheet.PreventStaggeredOption"), group: "Other"},
        ]), 
        groups: ['Characteristics',
        'Skills',
        'Other',
        ].map(i => game.i18n.localize(i))};
    }
}
