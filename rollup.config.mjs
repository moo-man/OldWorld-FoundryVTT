import fs from "fs";
import foundryPath from "./foundry-path.mjs";
import copy from "rollup-plugin-copy-watch";
import postcss from "rollup-plugin-postcss";
import bakedEnv from 'rollup-plugin-baked-env';
import simpleGit from 'simple-git';

let latest;
simpleGit().tags((err, tags) => latest = tags.latest);

let manifest = JSON.parse(fs.readFileSync("./system.json"));

let systemPath = foundryPath(manifest.id, manifest.compatibility.verified);

console.log("Setting Version " + latest)
console.log("Bundling to " + systemPath);

export default {
    input: [`./src/${manifest.id}.js`, `./style/${manifest.id}.scss`],
    output: {
        dir : systemPath,
        sourcemap : true
    },
    watch : {
        clareScreen: true
    },
    plugins: [
        bakedEnv(),
        copy({
            targets : [
                {src : "./system.json", dest : systemPath, transform: (contents) => contents.toString().replaceAll("@VERSION", latest)},
                {src : "./static/*", dest : systemPath},
            ],
            watch: process.env.NODE_ENV == "production" ? false : ["./static/*/**", "system.json"]
        }),
        postcss({
            extract : `${manifest.id}.css`,
            plugins: []
        })
    ]
};