require("dotenv").config();

const { EmbedBuilder, WebhookClient } = require("discord.js");
const { generateGuildInvite } = require("./generateGuildInvite");
const { BUGREPORT_WEBHOOK_URL } = process.env;
const embedTheme = require("../../information/embedThemes/error.json");
const {
	getUserIconUrl,
	getInteractionMessageLinkUrl,
	getGuildIconUrl,
	getProfileLinkUrl,
	getInviteLinkUrl,
} = require("./getUrls");

const sendErrorEmbed = async (interaction, error) => {
	const inviteToGoToServer = await generateGuildInvite(interaction.member.guild, interaction.channelId);

	const embed = await generateErrorEmbed(interaction, error, inviteToGoToServer);

	const webhookClient = new WebhookClient({ url: BUGREPORT_WEBHOOK_URL });
	webhookClient.send({
		username: error.isReport ? "Bug Report" : "Error",
		avatarURL: embedTheme.thumbnail.url,
		embeds: [embed],
	});
};

const generateErrorEmbed = async (interaction, error, invite) => {
	const interactionLinkUrl = getInteractionMessageLinkUrl(interaction.guildId, interaction.channelId, interaction.id);

	const embed = new EmbedBuilder(embedTheme)
		.setAuthor({
			name: interaction.user.username,
			iconURL: getUserIconUrl(interaction.user.id, interaction.user.avatar),
			url: interactionLinkUrl,
		})
		.setThumbnail(getGuildIconUrl(interaction.guildId, interaction.member.guild.icon))
		.setTitle(`${interaction.member.guild.name}\n${interactionLinkUrl}`)
		.setDescription(
			`[View Profile](${getProfileLinkUrl(interaction.userId, true)})\n[Go to Server](${getInviteLinkUrl(
				invite.code,
				true
			)})`
		)
		.setImage(error?.reportAttachment?.attachment ?? null);

	return addFieldsToErrorEmbed(embed, error);
};

const addFieldsToErrorEmbed = (embed, error) => {
	let fields = [];
	fields.push({
		name: "Message:",
		value: error?.reportMessage ?? "Failed to grab error; check console.",
		inline: false,
	});
	if (error?.reportFeature)
		embed.addFields([{ name: "Reported Feature:", value: error.reportFeature, inline: false }]);
	embed.addFields(fields);

	return embed;
};

class ErrorEmbed {
	constructor(interaction, error) {}
}

module.exports = { sendErrorEmbed };
