require("dotenv").config();

const fs = require("node:fs");
const { REST, Routes } = require("discord.js");
const { NODE_ENV, DISCORD_BOT_TOKEN, DISCORD_APPLICATION_ID, DEVELOPMENT_SERVER_ID } = process.env;

module.exports = (client) => {
	client.handleCommands = async () => {
		addCommandsFromFileToClient(client);
		await refreshSlashCommands(client);
	};
};

const addCommandsFromFileToClient = (client) => {
	const commandFolders = fs.readdirSync("./src/commands");

	for (const folder of commandFolders) {
		const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter((file) => file.endsWith(".js"));

		const { commands, globalCommandArray, guildCommandArray } = client;
		for (const file of commandFiles) {
			const command = require(`../../commands/${folder}/${file}`);
			commands.set(command.data.name, command);

			const clientCommandArrayReference = command.global ? globalCommandArray : guildCommandArray;
			clientCommandArrayReference.push(command.data.toJSON());

			console.log(`[EVENT]: Command \'${command.data.name}\' has been initialized.`);
		}
	}
};

const refreshSlashCommands = async (client) => {
	try {
		const { globalCommandArray, guildCommandArray } = client;
		const rest = new REST({ version: "9" }).setToken(DISCORD_BOT_TOKEN);

		console.log("[EVENT] Started refreshing application (/) commands.");

		if (NODE_ENV === "development") {
			const allCommands = [...globalCommandArray, ...guildCommandArray];
			await addGuildCommandsToGuild(rest, allCommands, DEVELOPMENT_SERVER_ID);
			await deleteAllGlobalCommands(rest);
		} else {
			await addGlobalCommands(rest, globalCommandArray);
			await addGuildCommandsToAllSpecifiedGuilds(rest, guildCommandArray, client);
		}

		console.log("[EVENT] Successfully reloaded application (/) commands.");
	} catch (err) {
		console.error(err);
	}
};

const addGuildCommandsToAllSpecifiedGuilds = async (rest, commandArray, client) => {
	const commandsToAddToGuilds = {};
	for (let command of commandArray) {
		const commandModule = client.commands.get(command.name);
		for (let guild of commandModule?.guilds || []) {
			commandsToAddToGuilds[guild] = commandsToAddToGuilds[guild]
				? [...commandsToAddToGuilds[guild], command]
				: [command];
		}
	}

	for (let [guildId, commands] of Object.entries(commandsToAddToGuilds)) {
		addGuildCommandsToGuild(rest, commands, guildId);
	}
};

const addGuildCommandsToGuild = async (rest, commandArray = [], guildId) => {
	return rest.put(Routes.applicationGuildCommands(DISCORD_APPLICATION_ID, guildId), {
		body: commandArray,
	});
};

const addGlobalCommands = async (rest, commandArray = []) => {
	await rest.put(Routes.applicationCommands(DISCORD_APPLICATION_ID), {
		body: commandArray,
	});
};

const deleteAllGlobalCommands = async (rest) => {
	return rest.put(Routes.applicationCommands(DISCORD_APPLICATION_ID), {
		body: [],
	});
};

const deleteAllGuildCommands = async (rest, client) => {
	const guildIds = client.getAllGuildIds();

	for (let guildId of guildIds) {
		deleteGuildCommands(rest, guildId);
	}
};

const deleteGuildCommands = async (rest, guildId) => {
	return rest.put(Routes.applicationGuildCommands(DISCORD_APPLICATION_ID, guildId), {
		body: [],
	});
};
