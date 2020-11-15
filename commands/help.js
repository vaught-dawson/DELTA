var { PREFIX } = require('../information/config.json');
const Discord = require('discord.js');

module.exports = {
	name: 'help',
	aliases: [ 'commands' ],
	description: 'List all commands or usage on specific commands.',
	usage: '<command name>',
	guildOnly: false,
	execute(message, args, server) {
		const { commands } = message.client;
		const embed = new Discord.MessageEmbed();
		var pre = PREFIX;
		if (!message.channel.type == 'dm') pre = server.prefix;

		if (!args.length) {
			embed.color = 15105570;
			embed.thumbnail = { url: 'https://i.ibb.co/2MHY6wn/D-E-L-T-A-4.jpg' };
			embed.title = "Here's a list of all my commands:";
			embed.footer = {
				text: `You can send \`${pre}help [command name]\` to get more info on a specific command!`,
				iconURL: 'https://i.ibb.co/Wzd001F/677a08d8682923ca8cb51fe48df38208.png'
			};

			commands.forEach((command) => {
				embed.addField(`${pre}${command.name}`, command.description, false);
			});

			return message.author
				.send(embed)
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply("I've sent you a DM with all my commands!");
				})
				.catch((error) => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply("It seems like I can't DM you! Do you have DMs disabled?");
				});
		}
		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find((c) => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply("That's not a valid command!");
		}

		embed.title = `Name: ${command.name}`;
		embed.color = 15105570;
		embed.thumbnail = { url: 'https://i.ibb.co/2MHY6wn/D-E-L-T-A-4.jpg' };
		embed.footer = {
			text: 'Resistance Logistics',
			iconURL: 'https://i.ibb.co/Wzd001F/677a08d8682923ca8cb51fe48df38208.png'
		};

		if (command.aliases) embed.addField('Aliases:', command.aliases.join(', '), false);
		if (command.description) embed.addField('Description:', command.description, false);
		if (command.usage) embed.addField('Usage:', `+${command.name} ${command.usage}`, false);

		return message.channel.send(embed);
	}
};
