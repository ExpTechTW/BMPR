const fs = require("fs");
const path = require("path");

function main() {
	return JSON.parse(fs.readFileSync(path.resolve("./Database/config/BMPR.json")).toString());
}

module.exports = {
	main,
};