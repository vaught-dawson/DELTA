const { getSpreadsheetName } = require('../functions/getSpreadsheetName.js');
const { getSpreadsheetInfo } = require('../functions/getSpreadsheetInfo.js');
const Discord = require('discord.js');

module.exports = {
	name: 'spreadsheetinfo',
	aliases: [ 'sheets' ],
	description: 'Get the info of the whole spreadsheet.',
	args: false,
	guildOnly: true,
	async execute(message, args, server) {
		var embed = new Discord.MessageEmbed({
			color: 15105570,
			title: await getSpreadsheetName(server.sheetId),
			fields: await getSpreadsheetInfo(server.sheetId),
			footer: {
				text: 'Resistance Logistics',
				icon_url: 'https://i.ibb.co/Wzd001F/677a08d8682923ca8cb51fe48df38208.png'
			}
		});
		message.channel.send(embed);
	}
};
