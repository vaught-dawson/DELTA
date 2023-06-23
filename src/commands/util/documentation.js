const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	global: true,
	guilds: null,
	data: new SlashCommandBuilder()
		.setName("documentation")
		.setDescription("Find the DELTA documentation")
		.setDMPermission(true),
	async execute(interaction, client) {
		const documentationLink = "https://sites.google.com/view/deltadocumentation";
		await interaction.reply({
			content: `[You can access the documentation site here!](${documentationLink})`,
		});
	},
};
