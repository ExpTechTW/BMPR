const reload = require('require-reload')(require)
const path = require('path')

const Console = reload('./BMPR-Release/BMPR-Release/core/console')
const Structure = reload('./BMPR-Release/BMPR-Release/core/structure')
const Loader = reload('./BMPR-Release/BMPR-Release/core/loader')
const Config = reload('./BMPR-Release/BMPR-Release/core/api/config')
const Handler = reload('./BMPR-Release/BMPR-Release/core/handler')
const Time = reload('./BMPR-Release/BMPR-Release/core/api/time')
const User = reload('./BMPR-Release/BMPR-Release/core/api/user')
const Help = reload('./BMPR-Release/BMPR-Release/core/api/help')
const Rely = reload('./BMPR-Release/BMPR-Release/core/api/rely')
const Permission = reload('./BMPR-Release/BMPR-Release/core/api/permission')

const Path = path.resolve("./Plugin/lock")

let Info = {
    "version": "1.0.0"
}

async function main(bmpr, args) {
    if (args != undefined) Info.reload = args
    reload('./BMPR-Release/BMPR-Release/core/client').main(bmpr, Info)
}

module.exports = {
    Info,
    main,
    Console,
    Structure,
    Loader,
    Config,
    Handler,
    Time,
    User,
    Permission,
    Help,
    Rely,
    Path
}
