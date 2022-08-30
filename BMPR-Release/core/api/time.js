function Simple() {
	const utc = new Date();
	const now = new Date(utc.getTime() + utc.getTimezoneOffset() * 60 * 1000 + 60 * 60 * 8 * 1000);
	return now.getHours() +
        ":" + now.getMinutes() +
        ":" + now.getSeconds();
}

function Full() {
	const utc = new Date();
	const now = new Date(utc.getTime() + utc.getTimezoneOffset() * 60 * 1000 + 60 * 60 * 8 * 1000);
	return now.getFullYear() +
        "/" + (now.getMonth() + 1) +
        "/" + now.getDate() +
        " " + now.getHours() +
        ":" + now.getMinutes() +
        ":" + now.getSeconds() +
        ":" + now.getMilliseconds();
}

module.exports = {
	Simple,
	Full,
};