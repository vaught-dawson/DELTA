require("dotenv").config();
const { REST, Routes } = require("discord.js");
const fs = require("node:fs");

module.exports = (client) => {
	client.handleCommands = async () => {
		const commandFolders = fs.readdirSync("./src/commands");

		for (const folder of commandFolders) {
			const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter((file) => file.endsWith(".js"));

			const { commands, commandArray } = client;
			for (const file of commandFiles) {
				const command = require(`../../commands/${folder}/${file}`);
				commands.set(command.data.name, command);
				commandArray.push(command.data.toJSON());
				console.log(`[EVENT]: Command \'${command.data.name}\' has been initialized.`);
			}
		}

		const clientId = process.env.DISCORD_APPLICATION_ID;
		const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_BOT_TOKEN);

		try {
			console.log("[EVENT] Started refreshing application (/) commands.");

			await rest.put(Routes.applicationCommands(clientId), {
				body: client.commandArray,
			});

			console.log("[EVENT] Successfully reloaded application (/) commands.");
		} catch (err) {
			console.error(err);
		}
	};
};
