const reload = require('require-reload')(require)

let Info = {
    "version": "1.0.0"
}

const main = reload('./B-MPR-Release/core/client')

main.main(Info)