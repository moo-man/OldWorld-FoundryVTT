import fs from "fs";

let path = "./scripts/"
let scripts = fs.readdirSync(path);
let count = 0;
let scriptObj = {};
for(let file of scripts)
{
  let script = fs.readFileSync(path + file, {encoding:"utf8"});
  scriptObj[file.split(".")[0]] = script;
  count++;
}

let scriptLoader = `export default function() 
{
    Hooks.on("init", () => 
    {
      foundry.utils.mergeObject(game.oldworld.config.effectScripts, ${JSON.stringify(scriptObj)});
    });

}`

fs.writeFileSync("./loadScripts.js", scriptLoader)
console.log(`Packed ${count} scripts`);