const fs = require('fs');
const path = '.\\information\\guilds.json';
const servers = require('../information/guilds.json');
const { addLogChannel } = require('./addLogChannel.js');

function addGuild(guild) {
	servers.guilds.push({
		name: guild.name.toLowerCase(),
		guildId: guild.id,
		commandChannelId: null,
		sheetId: null,
		prefix: '+',
		bugReportWebhookId: '771235196904669224',
		bugReportWebhookToken: 'sp8mQvbq3GLSKDgOJtnEOYF1PhT8Ar-CKA6czLzQ-cEDhoEs9EB5B0singwaZcJKzt2_'
	});
	fs.writeFile(path, JSON.stringify(servers, null, 2), function writeJSON(err) {
		if (err) {
			return console.log(err);
		}
	});
}

module.exports.addGuild = addGuild;
