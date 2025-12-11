export default class OldWorldCombatant extends Combatant
{
    _getInitiativeFormula()
    {
        return this.isNPC ? "0" : "1";
    }

}