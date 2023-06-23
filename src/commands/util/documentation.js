const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder().setName("documentation").setDescription("Find the DELTA documentation"),
	async execute(interaction, client) {
		await interaction.reply({
			content: "https://sites.google.com/view/deltadocumentation",
			ephemeral: true,
		});
	},
};
