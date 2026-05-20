let test = await this.actor.setupSkillTest('endurance', {appendTitle: ` - ${this.effect.name}`}); 
                    
                    if (test.failed) 
                    {
                        if (this.actor.hasCondition("defenceless"))
                        {
                            this.actor.addCondition("dead");
                        }
                        else 
                        {
                            this.actor.addCondition("defenceless");
                        }
                    }