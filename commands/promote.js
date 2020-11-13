const { promoteMember } = require('../functions/promoteMember.js');

module.exports = {
	name: 'promote',
	aliases: [ 'pmt', 'promo' ],
	description: 'Promotes a member on the roster (Up to SGM).',
	args: true,
	usage: '<member name>',
	guildOnly: true,
	async execute(message, args, server) {
		if (args.length > 1)
			return message.channel.send(`Invalid arguments! \nUsage: \`${server.prefix}${this.name} ${this.usage}\``);
		var userId = 'name';
		var userName = args[0];

		if (message.mentions.members.size == 1) {
			userId = message.mentions.members.first().id;
			if (message.guild.members.fetch(userId).nickname) userName = (await message.member.fetch(userId)).nickname;
			else userName = (await message.member.fetch(userId)).user.username;
		} else if (args[0].length == 18 && !isNaN(args[0])) {
			userId = args[0];
			if (message.guild.members.fetch(userId).nickname) userName = (await message.member.fetch(userId)).nickname;
			else userName = (await message.member.fetch(userId)).user.username;
		}
		return message.channel.send(await promoteMember(server.sheetId, userId, userName));
	}
};
