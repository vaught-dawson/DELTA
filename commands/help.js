var { prefixDefault } = require('../information/config.json');
const Discord = require('discord.js');

module.exports = {
	name: 'help',
	aliases: [ 'commands' ],
	description: 'List all commands or details on a specific commands.',
	usage: '<command name>',
	guildOnly: false,
	commandChannel: true,
	execute(message, args, server) {
		const { commands } = message.client;
		let prefix = prefixDefault;

		if (server) {
			prefix = server.prefix;
		}

		if (!args.length) {
			return dmUserAllCommands(message, prefix, commands);
		}

		const commandName = args[0].toLowerCase();
		const command = commands.get(commandName) || commands.find((c) => c.aliases && c.aliases.includes(commandName));

		if (!command) {
			return message.reply("That's not a valid command!");
		}

		return sendChannelSpecificCommandDetails(message, prefix, command);
	}
};

function dmUserAllCommands(message, prefix, commands) {
	let embed = new Discord.MessageEmbed()
		.setColor(15105570)
		.setThumbnail('https://i.ibb.co/2MHY6wn/D-E-L-T-A-4.jpg')
		.setTitle("Here's a list of all my commands:")
		.setFooter(
			`You can send \`${prefix}help [command name]\` to get more info on a specific command!`,
			'https://i.ibb.co/Wzd001F/677a08d8682923ca8cb51fe48df38208.png'
		);

	commands.forEach((command) => {
		embed.addField(`${prefix}${command.name}`, command.description, false);
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

function sendChannelSpecificCommandDetails(message, prefix, command) {
	let embed = new Discord.MessageEmbed()
		.setTitle(`Name: ${command.name}`)
		.setColor(15105570)
		.setThumbnail('https://i.ibb.co/2MHY6wn/D-E-L-T-A-4.jpg')
		.setFooter('Resistance Logistics', 'https://i.ibb.co/Wzd001F/677a08d8682923ca8cb51fe48df38208.png');

	if (command.aliases) {
		embed.addField('Aliases:', command.aliases.join(', '), false);
	}

	if (command.description) {
		embed.addField('Description:', command.description, false);
	}

	if (command.usage) {
		embed.addField('Usage:', `${prefix}${command.name} ${command.usage}`, false);
	}

	return message.channel.send(embed);
}
