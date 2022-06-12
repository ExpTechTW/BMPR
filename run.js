const reload = require('require-reload')(require)
const fs = require('fs')
const path = require("path")
const Downloader = require("nodejs-file-downloader")
const zl = require("zip-lib")
const fetch = require('node-fetch')

let bmpr = reload('./BMPR')

let list = fs.readdirSync(path.resolve("./Database/cache/"))
if (list.includes("Reload.tmp")) {
    fs.unlinkSync(path.resolve("./Database/cache/Reload.tmp"))
    Main("Reload from Clock")
} else {
    Main()
}

Update()

async function Main(args) {
    bmpr.main(bmpr, args)
}

async function Update() {
    setInterval(async () => {
        let list = fs.readdirSync(path.resolve("./Database/cache"))
        if (list.includes("update.tmp")) {
            let res = await fetch("https://raw.githubusercontent.com/ExpTechTW/BMPR/Release/BMPR.js")
            let text = await res.text()
            fs.writeFileSync(path.resolve("./BMPR.js"), text)
            const downloader = new Downloader({
                url: "https://github.com/ExpTechTW/BMPR/archive/refs/heads/Release.zip",
                directory: "./",
            })
            try {
                await downloader.download()
                const unzip = new zl.Unzip()
                await unzip.extract("./BMPR-Release.zip", path.resolve(""))
                fs.unlinkSync("./BMPR-Release.zip")
            } catch (error) {
                console.log("Download failed", error)
            }
            fs.writeFileSync(path.resolve("./Database/cache/reload.tmp"), "")
        }
    }, 1000)
}
