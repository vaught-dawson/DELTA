const { listMembers } = require('../functions/listMembers.js');
const { getSpreadsheetName } = require('../functions/getSpreadsheetName.js');
const Discord = require('discord.js');

module.exports = {
	name: 'members',
	aliases: [ 'mbrs', 'listmembers', 'lstmbrs', 'list', 'lst' ],
	description: 'Lists all members in a roster.',
	args: false,
	guildOnly: true,
	async execute(message, args, server) {
		if (args.length > 0)
			return message.channel.send(`Invalid arguments! \nUsage: \`${server.prefix}${this.name} ${this.usage}\``);
		var embed = new Discord.MessageEmbed({
			color: 15105570,
			thumbnail: { url: 'https://i.ibb.co/2MHY6wn/D-E-L-T-A-4.jpg' },
			title: await getSpreadsheetName(server.sheetId),
			fields: await listMembers(server.sheetId),
			footer: {
				text: 'Resistance Logistics',
				icon_url: 'https://i.ibb.co/Wzd001F/677a08d8682923ca8cb51fe48df38208.png'
			}
		});
		message.channel.send(embed);
	}
};
