const fs = require('fs');
const path = '.\\information\\guilds.json';
const servers = require('../information/guilds.json');

module.exports = {
	name: 'changeprefix',
	aliases: [ 'prefix', 'cngpre', 'prefixchange', 'setprefix' ],
	description: "Changes the server's prefix for DELTA.",
	args: true,
	usage: '<new prefix>',
	guildOnly: true,
	async execute(message, args, server) {
		if (!message.member.hasPermission('ADMINISTRATOR'))
			return message.channel.send(
				"You don't have the perms to change this! If this needs to be changed then talk to a server admin."
			);

		if (args.length > 1)
			return message.channel.send(`Invalid arguments! \nUsage: \`${server.prefix}${this.name} ${this.usage}\``);

		servers.guilds.forEach((guild) => {
			if (server.name == guild.name) {
				try {
					guild.prefix = args[0];
				} catch (err) {
					console.log(err);
					return message.channel.send(`There was a problem changing the prefix to \`${args[0]}\`.`);
				}
			}
		});

		fs.writeFile(path, JSON.stringify(servers, null, 2), function writeJSON(err) {
			if (err) {
				console.log(err);
				return message.channel.send('There was a problem saving to the config file.');
			}
		});

		message.channel.send(`Successfully changed the prefix to \`${args[0]}\`.`);
	}
};
