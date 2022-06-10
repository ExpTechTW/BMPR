const fs = require("fs");
const Downloader = require("nodejs-file-downloader")
const zl = require("zip-lib")
const Console = require('./console.js')

async function Update_core() {
    const downloader = new Downloader({
        url: "https://github.com/ExpTechTW/B-MPR/archive/refs/heads/Release.zip",
        directory: "./",
    })
    try {
        await Console.main("正在下載 更新包...", 3, "Core", "Update")
        await downloader.download()
        await Console.main("更新包 下載完成", 3, "Core", "Update")
        const unzip = new zl.Unzip()
        await Console.main("正在解壓縮 更新包...", 3, "Core", "Update")
        await unzip.extract("./B-MPR-Release.zip", "./")
        await Console.main("更新包 解壓縮完成", 3, "Core", "Update")
        await Console.main("已套用 更新包", 3, "Core", "Update")
        fs.unlinkSync("./B-MPR-Release.zip")
        await Console.main("已刪除 更新包", 3, "Core", "Update")
        await Console.main("更新完成", 2, "Core", "Update")
    } catch (error) {
        console.log("Download failed", error)
    }
}

module.exports = {
    Update_core
}