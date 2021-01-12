const { token, prefixDefault } = require('./information/config.json');
const { sendErrorEmbed } = require('./functions/sendErrorEmbed.js');
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
const servers = require('./information/guilds.json');
client.login(token);
client.on('ready', async () => {
	console.log(`Logged in as ${client.user.tag}!`);
});
client.on('message', async (message) => {
	if (message.author.bot) return;
	var prefix = message.content.substring(0, 1);
	var args = message.content.substring(1).split(/ +/);
	var commandName = args.shift().toLowerCase();
	var server, command;
	if (message.channel.type == 'dm') {
		if (message.mentions.has(client.user.id)) {
			message.channel.send(`I'm up! My prefix is \`+\`.`);
		};
		if (prefix != prefixDefault) return;
		command =
			client.commands.get(commandName) ||
			client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
		if (!command) return message.channel.send('Unknown command!');
		if (command.guildOnly) {
			return message.reply("I can't execute that command inside DMs!");
		}
	} else {
		let instances = servers.guilds.filter((o) => o.guildId === message.guild.id);
		for (let i = 0; i < instances.length; i++) {
			if (!instances[i]) return message.channel.send('This guild is not registered in my database!');
			if (message.content.includes("@here") || message.content.includes("@everyone")) continue;
			// if (message.mentions.has(client.user.id)) {
			// 	message.channel.send(`I'm up! My prefix is \`${instances[i].prefix}\`.`);
			// };
			command =
				client.commands.get(commandName) ||
				client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
			if (command) {
				if (instances[i].commandChannelId != message.channel.id && command.commandChannel == true) continue;
			}
			else if (!command) {
				if (instances[i].commandChannelId == message.channel.id) {
					if (message.mentions.has(client.user.id)) {
						return message.channel.send(`I'm up! My prefix is \`${instances[i].prefix}\`.`);
					}
					else {
						if (prefix != instances[i].prefix) continue;
						return message.channel.send('Unknown command!');
					}
				}
				else continue;
			}
			if (prefix != instances[i].prefix) continue;
			if (!message.member.hasPermission('MANAGE_ROLES')) {
				message.channel.send(
					"You don't have the perms to run DELTA commands. You need permissions to `MANAGE_ROLES`."
				);
			}
			if (command.sheets && instances[i].spreadsheetId == null) {
				return message.channel.send(
					`You don't have a Google Sheet configured!\nGet an admin to set it with: \`${instances[i].prefix}setSpreadsheetID <spreadsheet id>\`.`
				);
			}
			server = instances[i];
		}
	}
	if (!server) 
		return;
	if (command.args && !args.length)
		return message.channel.send(
			`You didn't add any arguments!\nThe proper usage would be: \`${server.prefix}${command.name} ${command.usage}\``
		);
	try {
		command.execute(message, args, server, client).catch(err => {
			console.log(err);
		});
	} catch (err) {
		await sendErrorEmbed(message, { message: `**Command:** ${message.content}\n**Error:** ${err}` });
		return message.channel.send('Command failed! A report with the error has automatically been sent to logistics.');
	}
});

const { addGuildToConfig } = require('./functions/addGuildToConfig.js');
client.on('guildCreate', (guild) => {
	addGuildToConfig(guild);
});

const { getMemberFromSheetById } = require('./functions/getMemberFromSheetById.js');
const { loadSpreadsheet } = require('./functions/loadSpreadsheet.js');
client.on('guildMemberRemove', async (member) => {
	let server = servers.guilds.find((server) => server.guildId === member.guild.id);
	if (!server) return;
	if (!server.announcementChannelId) return;
	const spreadsheet = await loadSpreadsheet(server.spreadsheetId);
	if (spreadsheet === null) 
		return message.channel.send('Invalid spreadsheet id! Make sure you set it up properly in the config.');
	var rosterSheet = spreadsheet.sheetsByTitle[server.rosterName];
if (!rosterSheet) 
			return message.channel.send('Invalid roster sheet name! Make sure you set it up properly in the config.');
	let rosterMember = await getMemberFromSheetById({ id: member.id }, rosterSheet, server);
	if (!rosterMember) return;
	if (rosterMember.length === 0) return;
	let announcementChannel = await client.channels.fetch(server.announcementChannelId);
	let embed = new Discord.MessageEmbed()
		.setTitle('Leave Notification')
		.setColor(15105570)
		.setAuthor(member.user.tag)
		.setDescription(`User \`${member.displayName} / ${rosterMember[server.nameHeader]}\` has left the discord and is still on the roster!`)
		.setFooter('Resistance Logistics', 'https://i.ibb.co/Wzd001F/677a08d8682923ca8cb51fe48df38208.png');
	announcementChannel.send(embed);
})

process.on('uncaughtException', (err) => {
	console.log(`Error: ${err.name}\n\nMessage: ${err.message}`);
});