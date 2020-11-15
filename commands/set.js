const { set } = require('../functions/set.js');

module.exports = {
	name: 'set',
	aliases: [ 'set' ],
	description: 'Sets data of members.',
	args: true,
	usage: '<name/rank/subdiv/promo/status/steam/discord/currency> <member name> <data>',
	guildOnly: true,
	async execute(message, args, server) {
		if (server.sheetId == null) {
			return message.channel.send(
				'This server does not have a sheet id set, notify the server owner to set this!'
			);
		}

		if (args.length != 3)
			return message.channel.send(`Invalid arguments! \nUsage: \`${server.prefix}${this.name} ${this.usage}\``);
		var userId = 'name';
		var userName = args[1];
		var subcommand = args[0].toLowerCase();
		var data = args[2];

		if (message.mentions.members.size == 1) {
			userId = message.mentions.members.first().id;
			userName = (await message.guild.members.fetch(userId)).displayName;
		} else if (userName.length == 18 && !isNaN(userName)) {
			userId = userName;
			userName = (await message.guild.members.fetch(userId)).displayName;
		}
		return message.channel.send(await set(userName, userId, subcommand, data, server.sheetId));
	}
};
