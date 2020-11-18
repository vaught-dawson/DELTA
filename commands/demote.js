const { demoteMember } = require('../functions/demoteMember.js');

module.exports = {
	name: 'demote',
	aliases: [ 'dmt', 'demo' ],
	description: 'Demotes a member on the roster.',
	args: true,
	usage: '<member name>',
	guildOnly: true,
	async execute(message, args, server) {
		if (server.sheetId == null) {
			return message.channel.send(
				'This server does not have a sheet id set, notify the server owner to set this!'
			);
		}

		var userId = 'name';
		var userName = args.join("_");

		if (message.mentions.members.size == 1) {
			userId = message.mentions.members.first().id;
			userName = (await message.guild.members.fetch(userId)).displayName;
		} else if (userName.length == 18 && !isNaN(userName)) {
			userId = userName;
			userName = (await message.guild.members.fetch(userId)).displayName;
		}
		return message.channel.send(await demoteMember(server.sheetId, userId, userName));
	}
};
