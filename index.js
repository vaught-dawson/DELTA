/* eslint-disable no-undef */
require('dotenv').config();

const { sendErrorEmbed } = require('./functions/sendErrorEmbed.js');
const { addGuildToConfig } = require('./functions/addGuildToConfig.js');
const { getMemberFromSheetById } = require('./functions/getMemberFromSheetById.js');
const { loadSpreadsheet } = require('./functions/loadSpreadsheet.js');
const { StaticMessage } = require('./util/StaticMessage.js');
const servers = require('./information/guilds.json');
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

client.login().catch(console.log('[ERROR] Failed to login.'));

client.on('ready', async () => {
	console.log(`[Event] Logged in as ${client.user.tag}!`);
	client.user.setPresence({
		status: 'online',
		activity: {
			name: 'hentai with Vad',
			type: 'WATCHING'
		}
	})

	await initializeCommands().then(console.log('[Event] Initialized commands.'));

	setInterval(() => {
		updateAllStaticMessages();
	}, 60*60*1000)
});

client.on('message', async (message) => {
	if (message.author.bot) return;

	var args = message.content.substring(1).split(/ +/);
	var commandName = args.shift().toLowerCase();
	var command = getCommandFromName(commandName);
	var server;

	if (message.channel.type == 'dm') {
		if (!canDMCommandRun(message, command)) return;
	} else {
		if (!canGuildCommandRun(message, command)) return;

		server = getServerFromGuildCommand(message, command, message.content.substring(0, 1));
		if (!server) return;
	}

	if (command.args && !args.length) {
		return message.channel.send(
			`You didn't add any arguments!\nThe proper usage would be: \`${server.prefix ||
				process.env.PREFIX_DEFAULT}${command.name} ${command.usage}\``
		);
	}

	try {
		command.execute(message, args, server, client).catch((err) => {
			console.log(err);
		});
	} catch (err) {
		await sendErrorEmbed(message, { message: `**Command:** ${message.content}\n**Error:** ${err}` });
		return message.channel.send(
			'Command failed! A report with the error has automatically been sent to logistics.'
		);
	}
});

async function initializeCommands() {
	new Promise((resolve) => {
		client.commands = new Discord.Collection();
		const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));
		for (const file of commandFiles) {
			const command = require(`./commands/${file}`);
			client.commands.set(command.name, command);
		}
		resolve(true);
	});
}

function canDMCommandRun(message, command) {
	if (message.mentions.has(client.user.id)) {
		message.channel.send(`I'm up! My prefix is \`${process.env.PREFIX_DEFAULT}\`.`);
		return false;
	}

	let prefix = message.content.substring(0, 1);
	if (prefix != process.env.PREFIX_DEFAULT) return false;

	if (!command) {
		message.channel.send('Unknown command!');
		return false;
	}

	if (command.guildOnly) {
		message.reply("I can't execute that command inside DMs!");
		return false;
	}
	return true;
}

function canGuildCommandRun(message, command) {
	let server;
	let prefix = message.content.substring(0, 1);

	if (command && command.commandChannel == false) {
		server = servers.guilds.filter((o) => o.guildId === message.guild.id);
		if (!server) return false;

		if (server.length > 1) {
			server = server.filter((o) => o.prefix === prefix);
		}

		server = server[0];
	} else {
		server = servers.guilds.find((o) => o.commandChannelId === message.channel.id);
	}

	if (!server) return false;

	if (!command) {
		if (message.mentions.has(client.user.id)) {
			message.channel.send(`I'm up! My prefix is \`${server.prefix}\`.`);
			return false;
		}

		if (server.commandChannelId === message.channel.id) {
			if (prefix == server.prefix) {
				message.channel.send('Unknown command!');
			}
		}

		return false;
	}

	if (prefix != server.prefix) return false;

	if (!message.member.hasPermission('MANAGE_ROLES')) {
		message.channel.send("You don't have the perms to run DELTA commands. You need permissions to `MANAGE_ROLES`.");
		return false;
	}

	if (command.sheets && server.spreadsheetId == null) {
		message.channel.send(
			`You don't have a Google Sheet configured!\nGet an admin to set it with: \`${server.prefix ||
				process.env.PREFIX_DEFAULT}setSpreadsheetID <spreadsheet id>\`.`
		);
		return false;
	}

	return true;
}

function getServerFromGuildCommand(message, command, prefix) {
	let server;
	if (command && command.commandChannel == false) {
		server = servers.guilds.filter((o) => o.guildId === message.guild.id);
		if (!server) return;

		if (server.length > 1) {
			server = server.filter((o) => o.prefix === prefix);
		}

		server = server[0];
	} else {
		server = servers.guilds.find((o) => o.commandChannelId === message.channel.id);
	}

	return server;
}

function getCommandFromName(commandName) {
	return (
		client.commands.get(commandName) ||
		client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName))
	);
}

client.on('guildCreate', (guild) => {
	addGuildToConfig(guild);
});

client.on('guildMemberRemove', async (member) => {
	let server = servers.guilds.find((server) => server.guildId === member.guild.id);

	if (!server) return;
	if (!server.announcementChannelId) return;

	const spreadsheet = await loadSpreadsheet(server.spreadsheetId);

	if (spreadsheet === null) {
		return message.channel.send('Invalid spreadsheet id! Make sure you set it up properly in the config.');
	}

	var rosterSheet = spreadsheet.sheetsByTitle[server.rosterName];

	if (!rosterSheet) {
		return message.channel.send('Invalid roster sheet name! Make sure you set it up properly in the config.');
	}

	let rosterMember = await getMemberFromSheetById({ id: member.id }, rosterSheet, server);

	if (!rosterMember) return;
	if (rosterMember.length === 0) return;

	let announcementChannel = await client.channels.fetch(server.announcementChannelId);

	let embed = new Discord.MessageEmbed()
		.setTitle('Leave Notification')
		.setColor(15105570)
		.setAuthor(member.user.tag)
		.setDescription(
			`User \`${member.displayName} / ${rosterMember[
				server.nameHeader
			]}\` has left the discord and is still on the roster!`
		)
		.setFooter('Resistance Logistics', 'https://i.ibb.co/Wzd001F/677a08d8682923ca8cb51fe48df38208.png');

	announcementChannel.send(embed);
});

process.on('uncaughtException', async (err) => {
	console.log(`Error: ${err.name}\n\nMessage: ${err.message}`);
	await sendErrorEmbed(message, { message: `**Error:** ${err}` });
});

function updateAllStaticMessages() {
	servers.guilds.forEach(guild => {
		if (guild.staticMessages.length === 0) return;
		guild.staticMessages.forEach(staticMessageFromFile => {
			let staticMessageObj = new StaticMessage(staticMessageFromFile);
			staticMessageObj.update(client);
		})
	})
}