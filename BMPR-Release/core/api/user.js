const fs = require("fs");
const path = require("path");

/**
 *
 * @param {string} User
 * @returns
 */
function main(User) {
	if (!fs.existsSync(path.resolve("./Database/cache/user.json")))
		fs.writeFileSync(path.resolve("./Database/cache/user.json"), "[]");
	const user = JSON.parse(fs.readFileSync(path.resolve("./Database/cache/user.json")).toString());
	for (let index = 0; index < user.length; index++)
		if (user[index]["id"] == User.id) {
			user[index] = User;
			fs.writeFileSync(path.resolve("./Database/cache/user.json"), JSON.stringify(user));
			return;
		}
	user.push(User);
	fs.writeFileSync(path.resolve("./Database/cache/user.json"), JSON.stringify(user));
	return;
}

module.exports = {
	main,
};