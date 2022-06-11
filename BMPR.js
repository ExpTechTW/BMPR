const reload = require('require-reload')(require)
const Console = reload('./BMPR-Release/core/console')
const Structure = reload('./BMPR-Release/core/structure')
const Loader = reload('./BMPR-Release/core/loader')
const Config = reload('./BMPR-Release/core/api/config')
const Handler = reload('./BMPR-Release/core/handler')
const Time = reload('./BMPR-Release/core/api/time')
const User = reload('./BMPR-Release/core/api/user')
const Help = reload('./BMPR-Release/core/api/help')
const Rely = reload('./BMPR-Release/core/api/rely')
const Permission = reload('./BMPR-Release/core/api/permission')

let Info = {
    "version": "1.0.1"
}

async function main(bmpr,args) {
    if (args != undefined) Info.reload = args
    reload('./BMPR-Release/core/client').main(bmpr,Info)
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
    Rely
}
