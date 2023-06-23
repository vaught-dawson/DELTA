const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { description, version } = require("../../../package.json");

module.exports = {
	global: true,
	guilds: null,
	data: new SlashCommandBuilder().setName("info").setDescription("See info about DELTA").setDMPermission(true),
	async execute(interaction, client) {
		const message = await interaction.deferReply({
			fetchReply: true,
		});

		const embedReply = new EmbedBuilder(require("../../information/embedThemes/default.json"))
			.setTitle(`${description} v${version}:`)
			.setDescription(
				"**Bot:** Made by Vio\n**Art:** Made by Ragnarok\n**Repository:** https://github.com/vaught-dawson/DELTA"
			);

		await interaction.editReply({
			embeds: [embedReply.data],
		});
	},
};
