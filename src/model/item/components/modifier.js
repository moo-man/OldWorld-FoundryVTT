let fields = foundry.data.fields;

export class ModifiersModel extends foundry.abstract.DataModel 
{
    static defineSchema()
    {
        let schema = {};
        schema.attacking = new fields.SchemaField({
            value : new fields.NumberField(),
            subject : new fields.StringField(),
            not : new fields.BooleanField(),
            condition : new fields.StringField(),
            label : new fields.StringField()
        })
        schema.defending = new fields.SchemaField({
            value : new fields.NumberField(),
            subject : new fields.StringField(),
            not : new fields.BooleanField(),
            condition : new fields.StringField(),
            label : new fields.StringField()
        })
        schema.damage = new fields.SchemaField({
            value : new fields.NumberField(),
            subject : new fields.StringField(),
            not : new fields.BooleanField(),
            condition : new fields.StringField(),
            label : new fields.StringField()
        })
        return schema;
    }

    createScripts()
    {
        let scripts = [];

        const conditionCode = {
            "armoured" : "isArmoured",
            "staggered" : "isStaggered",
            "mounted" : "isMounted",
            "prone" : "isProne"
        }

        const labelSubject = {
            "attacker" : "Attacker is",
            "defender" : "Defender is"
        }

        const labelCondition = {
            "armoured" : "Armoured",
            "staggered" : "Staggered",
            "mounted" : "Mounted",
            "prone" : "Prone"
        }

        if (this.attacking.value)
        {
            let attackingScript = {
                label : `Attacking with ${this.parent.parent.name}`,
                trigger : "dialog",
                script : this.attacking.value > 0 ? `args.fields.bonus += ${this.attacking.value}` : `args.fields.penalty += ${Math.abs(this.attacking.value)}`,
                options : {
                    hideScript : "return args.actor.system.opposed || args.skill != (this.item.system.skill || this.item.system.attack?.skill)"
                }
            };

            if (this.attacking.subject && this.attacking.condition)
            {
                attackingScript.label = `${labelSubject[this.attacking.subject]} ${this.attacking.not ? "not" : ""} ${labelCondition[this.attacking.condition]}`

                attackingScript.options.activateScript = `return `
                if (this.attacking.subject == "attacker")
                {
                    attackingScript.options.activateScript += "args.actor"
                }
                else if (this.attacking.subject == "defender")
                {
                    attackingScript.options.activateScript += "args.target?"
                }

                attackingScript.options.activateScript += `.system.${conditionCode[this.attacking.condition]}` + " && args.isAttack"

                if (this.attacking.not)
                {
                    attackingScript.options.activateScript = attackingScript.options.activateScript.replace("return ", "return !");
                }
            }
            else {
                attackingScript.options.activateScript = `return true`
            }
            if (this.attacking.label)
            {
                attackingScript.label = this.attacking.label;
            }
            scripts.push(attackingScript)
        }

        if (this.defending.value)
        {
            let defendingScript = {
                label : `Defending with ${this.parent.parent.name}`,
                trigger : "dialog",
                script : this.defending.value > 0 ? `args.fields.bonus += ${this.defending.value}` : `args.fields.penalty += ${Math.abs(this.defending.value)}`,
                options : {
                    hideScript : "return !args.actor.system.opposed"
                }
            };

            if (this.defending.subject && this.defending.condition)
            {

                defendingScript.label = `${labelSubject[this.defending.subject]} ${this.defending.not ? "not" : ""} ${labelCondition[this.defending.condition]}`

                defendingScript.options.activateScript = `return `
                if (this.defending.subject == "attacker")
                {
                    defendingScript.options.activateScript += "args.actor.system.opposedTest.actor"
                }
                else if (this.defending.subject == "defender")
                {
                    defendingScript.options.activateScript += "args.actor"
                }

                defendingScript.options.activateScript += `.system.${conditionCode[this.defending.condition]}` + ` && args.data.skill == "defence"`

                if (this.defending.not)
                {
                    defendingScript.options.activateScript = defendingScript.options.activateScript.replace("return ", "return !");
                }
            }
            else {
                defendingScript.options.activateScript = `return args.actor.system.opposed && args.data.skill == "defence"`
            }
            
            if (this.defending.label)
            {
                defendingScript.label = this.defending.label;
            }
            scripts.push(defendingScript)
        }



        if (this.damage.value)
        {
            let damageScript = {
                label : `${this.parent.parent.name} Damage Modifier`,
                trigger : "dialog",
                script : `args.fields.damage += ${this.damage.value}`,
                options : {
                    hideScript : "return args.actor.system.opposed || args.context.reload"
                }
            };

            if (this.damage.subject && this.damage.condition)
            {
                damageScript.label = `(Damage) ${labelSubject[this.damage.subject]} ${this.damage.not ? "not" : ""} ${labelCondition[this.damage.condition]}`

                damageScript.options.activateScript = `return `
                if (this.damage.subject == "attacker")
                {
                    damageScript.options.activateScript += "args.actor"
                }
                else if (this.damage.subject == "defender")
                {
                    damageScript.options.activateScript += "args.target?"
                }

                damageScript.options.activateScript += `.system.${conditionCode[this.damage.condition]}` + " && args.isAttack"

                if (this.damage.not)
                {
                    damageScript.options.activateScript = damageScript.options.activateScript.replace("return ", "return !");
                }
            }
            else {
                damageScript.options.activateScript = `return args.target`
            }
            
            if (this.damage.label)
            {
                damageScript.label = this.damage.label;
            }
            scripts.push(damageScript)
        }

        return scripts;
    }

}