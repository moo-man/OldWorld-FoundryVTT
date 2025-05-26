export class OldWorldTestMessageModel extends WarhammerTestMessageModel 
{

    static actions = {
        toggleDie : this._onToggleDie,
        expandDice : this._onExpandDice
    }

    async _onCreate(data, options, user)
    {
        let test = this.test;
        if (game.user.id == game.users.activeGM.id)
        {
            test.handleOpposed(this.parent);
        }
    }

    async _onUpdate(data, options, user)
    {
        let test = this.test;
        if (game.user.id == game.users.activeGM.id)
        {
            test.handleOpposed(this.parent);
        }
    }

    get test() 
    {
        let test = new (systemConfig().rollClasses[this.context.rollClass])(this);
        return test;
    }

    static _onExpandDice(ev, target)
    {
        target.closest(".reroll-container").querySelector(".reroll-breakdown")?.classList.toggle("expanded");
    }


    static _onToggleDie(ev, target)
    {
        target.classList.toggle("selected");
    }
}