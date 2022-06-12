const fs = require('fs')
const path = require("path")

let BMPR = null
let Loader = null
let Permission=null

async function init(bmpr) {
    BMPR = bmpr
    Loader = BMPR.Loader
    Permission=BMPR.Permission
}

async function main(msg) {
    if (msg.startsWith("bmpr upgrade")) fs.writeFileSync(path.resolve("./Database/cache/update.tmp"), "")
    if (msg.startsWith("bmpr reload")){
        fs.writeFileSync(path.resolve("./Database/cache/reload.tmp"), "")
        process.exit(0)
    } 
    if (msg.startsWith("bmpr plugin")) {
        if (msg.startsWith("bmpr plugin unload")) await Loader.PluginUnload(msg.replace("bmpr plugin unload ", ""))
        if (msg.startsWith("bmpr plugin load")) await Loader.PluginLoad(msg.replace("bmpr plugin load ", ""))
        if (msg.startsWith("bmpr plugin reloadall")) await Loader.Load(msg.replace("bmpr plugin reloadall ", ""))
    } else if (msg.startsWith("bmpr permission")) {
        if (msg.startsWith("bmpr permission set")) await Permission.set(msg.replace("bmpr permission set ", ""))
        if (msg.startsWith("bmpr permission get")) await Permission.get(msg.replace("bmpr permission get ", ""))
    }
}

module.exports = {
    init,
    main
}