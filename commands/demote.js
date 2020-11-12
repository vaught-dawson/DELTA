const { demoteMember } = require('../functions/demoteMember.js');

module.exports = {
	name: 'demote',
	aliases: [ 'dmt' ],
	description: 'Demotes a member on the roster.',
	args: true,
	usage: '<member name>',
	guildOnly: true,
	async execute(message, args, server) {
		if (args.length > 1) return message.channel.send('Invalid arguments. Usage: `+demote <member name>`');

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
		return message.channel.send(await demoteMember(server.sheetId, userId, userName));
	}
};
