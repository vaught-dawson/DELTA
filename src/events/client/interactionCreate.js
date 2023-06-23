module.exports = {
	name: "interactionCreate",
	async execute(interaction, client) {
		if (interaction.isChatInputCommand()) {
			const { commands } = client;
			const { commandName } = interaction;
			const command = commands.get(commandName);

			if (!command) return;

			try {
				await command.execute(interaction, client);
			} catch (err) {
				console.error(err);
				await interaction.reply({
					content: `Something went wrong while executing this command...\n\`${err.message}\``,
					ephemeral: true,
				});
			}
		}
	},
};
