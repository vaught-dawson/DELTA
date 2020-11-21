const fs = require('fs');
const path = '.\\information\\guilds.json';
const servers = require('../information/guilds.json');

function changeGuildConfig(guild, header, data) {
	servers.guilds.forEach((server) => {
		if (server == guild) server[header] = data;
	});

	fs.writeFile(path, JSON.stringify(servers, null, 2), function writeJSON(err) {
        if (err) {
            console.log(err);
            return message.channel.send('There was a problem saving to the config file.');
        }
    });
}

module.exports.changeGuildConfig = changeGuildConfig;
