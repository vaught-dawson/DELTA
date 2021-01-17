const fs = require('fs');
const path = require('path');
const servers = require('../information/guilds.json');

async function changeGuildConfig(guild, header, data) {
	servers.guilds.forEach((server) => {
		if (server == guild) server[header] = data;
	});

	let filePath = path.resolve('./information/guilds.json');

	fs.writeFile(filePath, JSON.stringify(servers, null, 2), function writeJSON(err) {
		if (err) {
			console.log(err);
			return message.channel.send('There was a problem saving to the config file.');
		}
	});
}

module.exports.changeGuildConfig = changeGuildConfig;
