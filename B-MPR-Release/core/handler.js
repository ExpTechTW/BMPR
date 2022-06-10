const reload = require('require-reload')(require)

async function main(msg) {
    if (msg.startsWith("mpr upgrade")) reload('./update').Update_core()
}

module.exports = {
    main
}