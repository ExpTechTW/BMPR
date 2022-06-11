const reload = require('require-reload')(require)
const Console = reload('./B-MPR-Release/core/console')
const Structure = reload('./B-MPR-Release/core/structure')
const Loader = reload('./B-MPR-Release/core/loader')
const Config = reload('./B-MPR-Release/core/api/config')
const Handler = reload('./B-MPR-Release/core/handler')
const Time = reload('./B-MPR-Release/core/api/time')
const User = reload('./B-MPR-Release/core/api/user')
const Help = reload('./B-MPR-Release/core/api/help')
const Rely = reload('./B-MPR-Release/core/api/rely')
const Permission = reload('./B-MPR-Release/core/api/permission')

let Info = {
    "version": "1.0.1"
}

async function main(bmpr) {
    reload('./B-MPR-Release/core/client').main(bmpr)
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
