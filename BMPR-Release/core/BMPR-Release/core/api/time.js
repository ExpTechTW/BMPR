async function Simple() {
    let utc = new Date()
    let now = new Date(utc.getTime() + utc.getTimezoneOffset() * 60 * 1000 + 60 * 60 * 8 * 1000)
    return now.getHours() +
        ":" + now.getMinutes() +
        ":" + now.getSeconds()
}

async function Full() {
    let utc = new Date()
    let now = new Date(utc.getTime() + utc.getTimezoneOffset() * 60 * 1000 + 60 * 60 * 8 * 1000)
    return now.getFullYear() +
        "/" + (now.getMonth() + 1) +
        "/" + now.getDate() +
        " " + now.getHours() +
        ":" + now.getMinutes() +
        ":" + now.getSeconds() +
        ":" + now.getMilliseconds()
}

module.exports = {
    Simple,
    Full
}