const fs = require('fs');
const path = '.\\information\\guilds.json';
const servers = require('../information/guilds.json');
const { getSpreadsheetName } = require('../functions/getSpreadsheetName.js');

module.exports = {
	name: 'setspreadsheetid',
	aliases: [ 'setsheet', 'setspreadhseet', 'setsheetid' ],
	description: "Changes the server's spreadsheet id for DELTA.",
	args: true,
	usage: '<guild id> <spreadsheet id>',
	guildOnly: false,
	async execute(message, args, server) {
		if (server != 'dm')
			return message.channel.send('This command needs to be completed by the server owner in a dm!');

		if (args.length != 2) {
			return message.channel.send(`Invalid Arguments! Usage: \`+${this.name} ${this.usage}\``);
		}

		try {
			var varGuild = await message.client.guilds.fetch(args[0]);
			if (varGuild == null) throw 'Invalid guild id!';
		} catch (err) {
			return message.channel.send('Invalid guild id!');
		}

		if (varGuild.ownerID != message.author.id) return message.channel.send("You don't own that discord server!");

		try {
			var sheetName = await getSpreadsheetName(args[1]);
		} catch (err) {
			return message.channel.send('Invalid Google Sheets id!');
		}

		servers.guilds.forEach((server) => {
			if (varGuild.id == server.guildId) {
				server.sheetId = args[1];
			}
		});

		fs.writeFile(path, JSON.stringify(servers, null, 2), function writeJSON(err) {
			if (err) {
				console.log(err);
				return message.channel.send('There was a problem saving to the config file.');
			}
		});

		return message.channel.send(`Sucessfully set the guild spreadsheet to \`#${sheetName}\`.`);
	}
};
