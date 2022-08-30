/* eslint-disable require-sort/require-sort */
const reload = require("require-reload")(require);
const path = require("path");
const fs = require("fs");

const Console = reload("./BMPR-Release/BMPR-Release/core/console");
const Structure = reload("./BMPR-Release/BMPR-Release/core/structure");
const Loader = reload("./BMPR-Release/BMPR-Release/core/loader");
const Config = reload("./BMPR-Release/BMPR-Release/core/api/config");
const Handler = reload("./BMPR-Release/BMPR-Release/core/handler");
const Time = reload("./BMPR-Release/BMPR-Release/core/api/time");
const User = reload("./BMPR-Release/BMPR-Release/core/api/user");
const Help = reload("./BMPR-Release/BMPR-Release/core/api/help");
const Rely = reload("./BMPR-Release/BMPR-Release/core/api/rely");
const Permission = reload("./BMPR-Release/BMPR-Release/core/api/permission");

const PathData = path.resolve("./Database/plugin");
const Path = path.resolve("");
const PathLock = path.resolve("./Plugin/lock");

const Info = {
	"version": "1.0.4",
};

function main(bmpr, args) {
	init();
	if (args != undefined) Info.reload = args;
	reload("./BMPR-Release/BMPR-Release/core/client").main(bmpr, Info);
}

function init() {
	if (!fs.existsSync(path.resolve("./Database/plugin")))
		fs.mkdirSync("./Database/plugin");

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
	Rely,
	PathData,
	Path,
	PathLock,
};
