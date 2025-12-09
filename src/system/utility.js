export default class OldWorldUtility
{

    static async skillDialog({text="Choose Skill", title="Skill", defaultValue}={})
    {
        let skills = Object.keys(game.oldworld.config.skills);

        return (await ItemDialog.create(skills.map(i => {return {id: i, name: game.oldworld.config.skills[i]}}), 1, {text, title, defaultValue}))[0].id;
    }

    static async characteristicDialog({text="Choose Characteristic", title="Characteristic", defaultValue}={})
    {
        let skills = Object.keys(game.oldworld.config.characteristics);

        return (await ItemDialog.create(skills.map(i => {return {id: i, name: game.oldworld.config.characteristics[i]}}), 1, {text, title, defaultValue}))[0].id;
    }

}