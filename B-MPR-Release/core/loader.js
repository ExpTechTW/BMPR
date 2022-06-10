const reload = require('require-reload')(require)
const fs = require('fs')
const path = require("path")
const zl = require("zip-lib")

let Function = {}

async function init() {
    // let list = fs.readdirSync(path.resolve("./Plugin"))
    // for (let index = 0; index < list.length; index++) {
    //     if (list[index] != "lock" && (list[index].includes(".js") || list[index].includes(".zip"))) {
    //         fs.copyFileSync(path.resolve("./Plugin/" + list[index]), path.resolve("./Plugin/lock/" + list[index]))
    //         const unzip = new zl.Unzip()
    //         await unzip.extract(path.resolve("./Plugin/lock/" + list[index]), path.resolve("./Plugin/lock/"))
    //         fs.unlinkSync(path.resolve("./Plugin/lock/" + list[index]))
    //     }
    // }
    reload('../../Plugin/lock/Example/example.js')
}

module.exports = {
    init
}