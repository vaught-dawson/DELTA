const { getMemberData } = require('../functions/getMemberData.js');
const { addMemberToSheet } = require('../functions/addMemberToSheet.js');
const { removeMember } = require('../functions/removeMember.js');

module.exports = {
	name: 'member',
	aliases: [ 'mbr' ],
	description: 'Manage members.',
	args: true,
	sheets: true,
	usage: '<add/remove/info> <member name>',
	guildOnly: true,
	async execute(message, args, server) {
		if (args.length <= 1 || args == undefined) return message.channel.send(`Invalid Arguments! Usage: \`${server.prefix}${this.name} ${this.usage}\``)
		if (args[1].length > 256) return message.channel.send('Name is too long! The name field maxes out at \`256\` characters.')
		var subcommand = args.shift().toLowerCase();
		var userId = 'name';
		var userName = args.join("_");

		if (server.sheetId == null) {
			return message.channel.send(
				'This server does not have a sheet id set, notify the server owner to set this!'
			);
		}

		if (message.mentions.members.size == 1) {
			userId = message.mentions.members.first().id;
			userName = (await message.guild.members.fetch(userId)).displayName.split(/ +/).join("_");
		} else if (userName.length == 18 && !isNaN(userName)) {
			userId = userName;
			userName = (await message.guild.members.fetch(userId)).displayName.split(/ +/).join("_");
		}

		switch (subcommand) {
			case 'add':
				return message.channel.send(await addMemberToSheet(server.sheetId, userId, userName));
			case 'remove':
				return message.channel.send(await removeMember(server.sheetId, userId, userName));
			case 'info':
				return message.channel.send(await getMemberData(server.sheetId, userId, userName));
			default:
				return message.channel.send(
					`Invalid arguments! \nUsage: \`${server.prefix}${this.name} ${this.usage}\``
				);
		}
	}
};
