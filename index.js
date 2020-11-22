const fs = require('fs');
const Discord = require('discord.js');
const { TOKEN } = require('./information/config.json');
const client = new Discord.Client();

//Setting up commands
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
//Setting up servers
const servers = require('./information/guilds.json');
client.login(TOKEN);
client.on('ready', async () => {
	console.log(`Logged in as ${client.user.tag}!`);
});
client.on('message', async (message) => {
	if (message.author.bot) return;
	//Checks if the message isn't a dm
	var server = null;
	var prefix = '+';
	if (message.channel.type != 'dm') {
		//Checks if the guild & channel are valid
		servers.guilds.forEach((guild) => {
			if (guild.guildId == message.guild.id) {
				if (guild.commandChannelId == message.channel.id) {
					server = guild;
					prefix = guild.prefix;
				} else if (guild.commandChannelId == null) {
					server = guild;
				}
			}
		});
		if (server == null) return;
		if (server.commandChannelId == null)
			return message.channel.send(
				'This server does not have a command channel set, notify a server admin to set this!'
			);
	} else server = 'dm';
	if (server == null) return;
	if (!message.content.startsWith(prefix)) {
		if (message.channel.type != 'dm' && message.mentions.members.size == 1) {
			if (message.mentions.members.first().id == client.user.id) {
				return message.channel.send(`My prefix is \`${prefix}\`.`);
			}
		}
		return;
	}

	if (message.channel.type != 'dm') {
		if (!message.member.hasPermission('MANAGE_ROLES')) {
			return message.channel.send(
				"You don't have the perms to run DELTA commands. You need permissions to `MANAGE_ROLES`."
			);
		}
	}

	var args = message.content.substring(1).split(/ +/);
	var commandName = args.shift().toLowerCase();

	//Checks if the user input is a valid command
	const command =
		client.commands.get(commandName) ||
		client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return message.channel.send('Unknown command!');
	//Checks if the command is guild-only
	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply("I can't execute that command inside DMs!");
	}
	//Checks if the command requires arguments
	if (command.args && !args.length)
		return message.channel.send(
			`You didn't add any arguments!\nThe proper usage would be: \`${server.prefix}${command.name} ${command.usage}\``
		);
	if (command.sheets && server.sheetId == null)
		return message.channel.send(
			`You don't have a Google Sheet configured!\nGet an admin to set it with: \`${server.prefix}setSpreadsheetID <spreadsheet id>\`.`
		);
	//Run command block
	try {
		command.execute(message, args, server);
	} catch (error) {
		console.error(error);
		return message.channel.send('There was an error executing the command.');
	}
});

const { addGuildToConfig } = require('./functions/addGuildToConfig.js');
client.on('guildCreate', (guild) => {
	addGuildToConfig(guild);
});

process.on('uncaughtException', (err) => {
	console.log(`Error: ${err.name}\n\nMessage: ${err.message}`);
});
