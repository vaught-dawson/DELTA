const { SlashCommandBuilder, SlashCommandStringOption, SlashCommandAttachmentOption } = require("discord.js");
const { sendErrorEmbed } = require("../../functions/util/sendErrorEmbed");

module.exports = {
	global: true,
	guilds: null,
	data: new SlashCommandBuilder()
		.setName("bugreport")
		.setDescription("Report a bug in DELTA")
		.addStringOption(
			new SlashCommandStringOption()
				.setName("message")
				.setDescription("Explain the details of the bug here")
				.setRequired(true)
				.setMaxLength(1024)
		)
		.addStringOption(
			new SlashCommandStringOption()
				.setName("feature")
				.setDescription("Which feature/command does the bug involve")
				.setRequired(false)
				.setMaxLength(1024)
		)
		.addAttachmentOption(
			new SlashCommandAttachmentOption()
				.setName("attachment")
				.setDescription("Show images of the bug if applicable")
				.setRequired(false)
		)
		.setDMPermission(true),
	async execute(interaction, client) {
		const message = await interaction.deferReply({
			fetchReply: true,
		});

		const reportMessage = interaction.options.getString("message"),
			reportFeature = interaction.options.getString("feature"),
			reportAttachment = interaction.options.getAttachment("attachment");

		let error = {
			isReport: true,
			reportMessage,
			reportFeature,
			reportAttachment,
		};

		let reply;
		try {
			await sendErrorEmbed(interaction, error);
			reply = "Successfully sent bug report!";
		} catch (err) {
			await sendErrorEmbed(interaction, {
				reportMessage: `**Command:** ${interaction.commandName ?? "None"}\n**Error:** ${err}`,
				reportFeature: reportFeature ?? "None",
				reportAttachment: reportAttachment ?? null,
			});
			reply = "Failed to send bug report.";
		}

		await interaction.editReply({
			content: reply,
		});
	},
};
