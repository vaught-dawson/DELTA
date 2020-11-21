const { listMembers } = require('../functions/listMembers.js');
const { getSpreadsheetName } = require('../functions/getSpreadsheetName.js');
const Discord = require('discord.js');

module.exports = {
	name: 'members',
	aliases: [ 'mbrs', 'listmembers', 'lstmbrs', 'list', 'lst' ],
	description: 'Lists all members in a roster.',
	sheets: true,
	usage: '<here?>',
	guildOnly: true,
	async execute(message, args, server) {
		if (server.sheetId == null) {
			return message.channel.send(
				'This server does not have a sheet id set, notify the server owner to set this!'
			);
		}

		if (args.length > 1)
			return message.channel.send(`Invalid arguments! \nUsage: \`${server.prefix}${this.name} ${this.usage}\``);

		var members = await listMembers(server.sheetId);
		var spreadsheetName = await getSpreadsheetName(server.sheetId);
		var isFirstEmbed = true;
		var embeds = [];

		while (members.length > 0) {
			let fields = [];
			for (let i = 0; i < 24; i++) {
				if (members.length == 0) break;
				fields.push(members.shift());
			}
			var embed = new Discord.MessageEmbed({
				color: 15105570,
				fields: fields
			});
			if (isFirstEmbed) {
				embed.setTitle(spreadsheetName);
				embed.setThumbnail('https://i.ibb.co/2MHY6wn/D-E-L-T-A-4.jpg');
				isFirstEmbed = false;
			}

			if (members.length == 0) {
				embed.setFooter(
					'Resistance Logistics',
					'https://i.ibb.co/Wzd001F/677a08d8682923ca8cb51fe48df38208.png'
				);
			}

			embeds.push(embed);
		}

		embeds.forEach((embed) => {
			if (args.length == 1) 
				message.channel.send(embed);
			else 
				message.author.send(embed);
		});

		if (args.length == 0)
			return message.reply(`I've sent you a DM with the list of members!\nIf you wanted to display them here, run \`${server.prefix}${this.name} here\``);
	}
};
