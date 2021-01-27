const fs = require('fs');
const path = require('path');
const servers = require('../information/guilds.json');

function addGuildToConfig(guild) {
	servers.guilds.push({
		guildName: guild.name.toLowerCase(),
		guildId: guild.id,
		commandChannelId: null,
		announcementChannelId: null,
		spreadsheetId: null,
		prefix: '+',
		rosterName: 'Roster',
		nameHeader: 'Name',
		rankHeader: 'Rank',
		lastPromotionDateHeader: 'LastPromo',
		statusHeader: 'Status',
		discordHeader: 'Discord',
		rankStructure: 'standard',
		memberLogPrefix: 'Resistance',
		staticMessages: []
	});

	let filePath = path.resolve('./information/guilds.json');

	fs.writeFile(filePath, JSON.stringify(servers, null, 2), function writeJSON(err) {
		if (err) {
			return console.log(err);
		}
	});
}

module.exports.addGuildToConfig = addGuildToConfig;
