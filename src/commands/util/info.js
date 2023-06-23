const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { description, version } = require("../../../package.json");

module.exports = {
	data: new SlashCommandBuilder().setName("info").setDescription("See info about DELTA"),
	async execute(interaction, client) {
		const message = await interaction.deferReply({
			fetchReply: true,
			ephemeral: true,
		});

		const embedReply = new EmbedBuilder()
			.setColor(10921638)
			.setThumbnail("https://i.ibb.co/jrkXVxp/deltasmallogo-fotor-20230622211617.png")
			.setTitle(`${description} v${version}:`)
			.setDescription(
				"**Bot:** Made by Vio\n**Art:** Made by Ragnarok\n**Repository:** https://github.com/vaught-dawson/DELTA"
			)
			.setFooter({
				text: "DELTA",
				iconURL: "https://i.ibb.co/0GNv9Jq/Delta-PNG-transparent.png",
			});

		await interaction.editReply({
			embeds: [embedReply.data],
			ephemeral: true,
		});
	},
};
