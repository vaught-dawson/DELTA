const fs = require('fs');
const path = '.\\information\\guilds.json';
const servers = require('../information/guilds.json');

module.exports = {
	name: 'setcommandchannel',
	aliases: [ 'commandchannel', 'setchannel', 'channelset' ],
	description: "Changes the server's command channel for DELTA.",
	args: true,
	usage: '<guild id> <channel id>',
	guildOnly: false,
	async execute(message, args, server) {
		if (server != 'dm')
			return message.channel.send('This command needs to be completed by the server owner in a dm!');

		if (args.length != 2) {
			return message.channel.send(`Invalid Arguments! Usage: \`+${this.name} ${this.usage}\``);
		}

		try {
			var varGuild = await message.client.guilds.fetch(args[0]);
			if (varGuild == null) throw 'Invalid guild id!';
		} catch (err) {
			return message.channel.send('Invalid guild id!');
		}

		if (varGuild.ownerID != message.author.id) return message.channel.send("You don't own that discord server!");

		if ((await varGuild.channels.cache.get(args[1])) == undefined)
			return message.channel.send('The channel specified is not in that server!');

		servers.guilds.forEach((server) => {
			if (varGuild.id == server.guildId) {
				server.commandChannelId = args[1];
			}
		});

		fs.writeFile(path, JSON.stringify(servers, null, 2), function writeJSON(err) {
			if (err) {
				console.log(err);
				return message.channel.send('There was a problem saving to the config file.');
			}
		});

		return message.channel.send(
			`Sucessfully set the guild command channel to \`#${await varGuild.channels.cache.get(args[1]).name}\`.`
		);
	}
};
