const { set } = require('../functions/set.js');

module.exports = {
	name: 'set',
	aliases: [ 'set' ],
	description: 'Sets data of members.',
	args: true,
	usage: '<name/rank/subdiv/promo/status/steam/discord/currency> <member name> <data>',
	guildOnly: true,
	async execute(message, args, server) {
		if (args.length != 3)
			return message.channel.send(
				'Invalid arguments. Usage: `+set <name/rank/subdiv/promo/status/steam/discord/currency> <member name> <data>`'
			);
		var userId = 'name';
		var userName = args[1];
		var subcommand = args[0].toLowerCase();
		var data = args[2];

		if (message.mentions.members.size == 1) {
			userId = message.mentions.members.first().id;
			if (message.guild.members.fetch(userId).nickname) userName = (await message.member.fetch(userId)).nickname;
			else userName = (await message.member.fetch(userId)).user.username;
		} else if (args[1].length == 18 && !isNaN(args[1])) {
			userId = args[0];
			if (message.guild.members.fetch(userId).nickname) userName = (await message.member.fetch(userId)).nickname;
			else userName = (await message.member.fetch(userId)).user.username;
		}
		return message.channel.send(await set(userName, userId, subcommand, data, server.sheetId));
	}
};
