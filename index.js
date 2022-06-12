const child_process = require("child_process")
const path = require('path')
const fs = require('fs')

let Main = null

if (!fs.existsSync(path.resolve(`./Database/cache`))) {
    fs.mkdirSync(`./Database/cache`)
}
if (!fs.existsSync(path.resolve(`./Database/data`))) {
    fs.mkdirSync(`./Database/data`)
}
if (!fs.existsSync(path.resolve("./Plugin"))) {
    fs.mkdirSync("./Plugin")
}
if (!fs.existsSync(path.resolve("./Plugin/lock"))) {
    fs.mkdirSync("./Plugin/lock")
}

main()

async function main() {
    Main = child_process.exec(`cd ${path.resolve("")} & node run.js`)
    Main.stdout.on('data', (data) => {
        console.log(data.replaceAll("\n", ""))
    })
    Main.on('error', function (err) {
        console.log('Main error', err)
    })
    Main.on('close', function (err) {
        let list = fs.readdirSync(path.resolve("./Database/cache"))
        if (list.includes("reload.tmp")) {
            fs.unlinkSync(path.resolve("./Database/cache/reload.tmp"))
            fs.writeFileSync(path.resolve("./Database/cache/Reload.tmp"), "")
            main()
        }else{
            process.exit(0)
        }
    })
    process.stdin.on('readable', () => {
        let chunk
        while ((chunk = process.stdin.read()) !== null) {
            Main.stdin.write(chunk)
        }
    })
    let info = {
        PID: process.pid,
        pid: Main.pid,
        platform: process.platform
    }
    fs.writeFileSync(path.resolve("./Database/cache/info.tmp"), JSON.stringify(info))
}