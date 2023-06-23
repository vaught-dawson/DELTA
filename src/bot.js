require("dotenv").config();

const fs = require("node:fs");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { DISCORD_BOT_TOKEN } = process.env;

const client = new Client({ intents: GatewayIntentBits.Guilds });
client.commands = new Collection();
client.globalCommandArray = [];
client.guildCommandArray = [];

client.getAllGuildIds = function () {
	const guildIds = Array.from(client.guilds.cache.keys());
	return guildIds;
};

const functionFolders = fs.readdirSync("./src/functions");
for (const folder of functionFolders) {
	const functionFiles = fs.readdirSync(`./src/functions/${folder}`).filter((file) => file.endsWith(".js"));

	for (const file of functionFiles) {
		const module = require(`./functions/${folder}/${file}`);
		if (typeof module === "function") module(client);
	}
}

const startup = async () => {
	await client.login(DISCORD_BOT_TOKEN);

	client.handleEvents();
	client.handleCommands();
};

startup();
