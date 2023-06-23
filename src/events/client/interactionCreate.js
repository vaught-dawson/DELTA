const fs = require("node:fs");
const { cwd } = require("node:process");

let devCommandNames = {};

console.debug("cwd:", cwd());
const devCommandFiles = fs.readdirSync(`${cwd()}/src/commands/dev`).filter((file) => file.endsWith(".js"));

for (const file of devCommandFiles) {
	const command = require(`${cwd()}/src/commands/dev/${file}`);
	const commandName = command?.data?.name || "help";
	devCommandNames[commandName] = true;
}

module.exports = {
	name: "interactionCreate",
	async execute(interaction, client) {
		if (interaction.isChatInputCommand()) {
			const { commands } = client;
			const { commandName } = interaction;
			const command = commands.get(commandName);

			if (!command || !command?.execute) return;

			try {
				if (canUserRunCommand(interaction)) {
					await command.execute(interaction, client);
				} else {
					throw new Error("You do not have permission to use this command!");
				}
			} catch (err) {
				console.error(err);
				await interaction.reply({
					content: `Something went wrong while executing this command...\n\`${err.message}\``,
					ephemeral: true,
				});
			}
		} else if (interaction.isAutocomplete()) {
			const { commands } = client;
			const { commandName } = interaction;
			const command = commands.get(commandName);

			if (!command || !command?.autocomplete) return;

			try {
				await command.autocomplete(interaction, client);
			} catch (err) {
				console.error(err);
			}
		}
	},
};

const canUserRunCommand = (interaction) => {
	const isDevCommand = devCommandNames[interaction.commandName],
		devUserId = "203944534839656448";

	if (isDevCommand && interaction.user.id !== devUserId) return false;
	return true;
};

// const extractArgumentsFromInteraction = (interaction, slashCommand) => {
// 	let arguments = {};

// 	for (let option of slashCommand.options) {
// 		switch (option.constructor.name) {
// 			case "SlashCommandStringOption":
// 				arguments[option.name] = interaction.options.getString(option.name);
// 		}
// 	}

// 	return arguments;
// };
