const reload = require('require-reload')(require)
const fs = require('fs')
const path = require("path")
const Downloader = require("nodejs-file-downloader")
const zl = require("zip-lib")
const fetch = require('node-fetch')

let bmpr = reload('./BMPR')
Main()
Clock()
Update()

process.stdin.on('data', async data => {
    data = `\n${data}`
    data = data.replaceAll("\n", "")
    if (data.startsWith("bmpr reload")) {
        Reload("Reload from Console")
    }
})

async function Reload(args) {
    bmpr = reload('./BMPR')
    setTimeout(() => { Main(args) }, 1000)
}

async function Main(args) {
    bmpr.main(bmpr, args)
}

async function Update() {
    setInterval(async () => {
        let list = fs.readdirSync(path.resolve(""))
        if (list.includes("update.tmp")) {
            fs.unlinkSync(path.resolve("./update.tmp"))
            let res = await fetch("https://raw.githubusercontent.com/ExpTechTW/BMPR/Release/BMPR.js")
            let text = await res.text()
            //fs.writeFileSync(path.resolve("./BMPR.js"), text)
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
            Reload("Reload from Update")
        }
    }, 1000)
}

async function Clock() {
    setInterval(async () => {
        let list = fs.readdirSync(path.resolve(""))
        if (list.includes("reload.tmp")) {
            fs.unlinkSync(path.resolve("./reload.tmp"))
            Reload("Reload from Clock")
        }
    }, 1000)
}