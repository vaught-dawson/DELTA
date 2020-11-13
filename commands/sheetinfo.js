const { getSheetInfo } = require('../functions/getSheetInfo.js');
const { getSpreadsheetName } = require('../functions/getSpreadsheetName.js');
const Discord = require('discord.js');

module.exports = {
	name: 'sheetinfo',
	aliases: [ 'sheet' ],
	description: "Gets a roster sheet's info.",
	args: true,
	usage: '<sheet name>',
	guildOnly: true,
	async execute(message, args, server) {
		if (server.sheetId == null) {
			return message.channel.send(
				'This server does not have a sheet id set, notify the server owner to set this!'
			);
		}

		//Combining the remaining arguments into a complete sheet name
		var sheetName = '';
		for (let i = 0; i < args.length; i++) {
			if (i == args.length - 1) sheetName += args[i];
			else sheetName += args[i] + ' ';
		}
		var info = await getSheetInfo(sheetName, server.sheetId);
		if (info == null) return message.channel.send(`Could not find the sheet called: \`${sheetName}\``);
		var embed = new Discord.MessageEmbed({
			color: 15105570,
			title: await getSpreadsheetName(server.sheetId),
			fields: [ { name: `Sheet: ${info[0]}`, value: `Rows: ${info[1]}`, inline: true } ],
			footer: {
				text: 'Resistance Logistics',
				icon_url: 'https://i.ibb.co/Wzd001F/677a08d8682923ca8cb51fe48df38208.png'
			}
		});
		message.channel.send(embed);
	}
};
