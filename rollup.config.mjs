import fs from "fs";
import foundryPath from "./foundry-path.mjs";
import copy from "rollup-plugin-copy-watch";
import postcss from "rollup-plugin-postcss";
import bakedEnv from 'rollup-plugin-baked-env';

let manifest = JSON.parse(fs.readFileSync("./system.json"));

let systemPath = foundryPath(manifest.id, manifest.compatibility.verified);

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
                {src : "./template.json", dest : systemPath},
                {src : "./system.json", dest : systemPath},
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