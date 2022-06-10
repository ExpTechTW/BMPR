const reload = require('require-reload')(require)
const Console = reload('./core/console')
const Structure = reload('./core/structure')
const Loader = reload('./core/loader')

module.exports = {
    Console,
    Structure,
    Loader
}