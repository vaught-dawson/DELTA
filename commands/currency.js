const { changeCurrency } = require('../functions/changeCurrency.js');

module.exports = {
	name: 'currency',
	aliases: [ 'money', 'bal', 'balance' ],
	description: "Modifies a member's currency.",
	args: true,
	usage: '<+/- monetary change> <member name>',
	guildOnly: true,
	async execute(message, args, server) {
		if (server.sheetId == null) {
			return message.channel.send(
				'This server does not have a sheet id set, notify the server owner to set this!'
			);
		}

		if (args.length != 2)
			return message.channel.send(`Invalid arguments! \nUsage: \`${server.prefix}${this.name} ${this.usage}\``);
		var userId = 'name';
		var monetaryChange = args[0];
		var userName = args[1];

		if (message.mentions.members.size == 1) {
			userId = message.mentions.members.first().id;
			if (message.guild.members.fetch(userId).nickname) userName = (await message.member.fetch(userId)).nickname;
			else userName = (await message.member.fetch(userId)).user.username;
		} else if (args[0].length == 18 && !isNaN(args[0])) {
			userId = args[0];
			if (message.guild.members.fetch(userId).nickname) userName = (await message.member.fetch(userId)).nickname;
			else userName = (await message.member.fetch(userId)).user.username;
		}
		return message.channel.send(await changeCurrency(server.sheetId, userId, userName, monetaryChange));
	}
};
