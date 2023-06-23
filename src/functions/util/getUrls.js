const getGuildIconUrl = (guildId, icon) => {
	return `https://cdn.discordapp.com/icons/${guildId}/${icon}.webp`;
};

const getUserIconUrl = (userId, avatar) => {
	return `https://cdn.discordapp.com/avatars/${userId}/${avatar}.webp`;
};

const getInteractionMessageLinkUrl = (guildId, channelId, interactionId) => {
	return `https://discord.com/channels/${guildId}/${channelId}/${interactionId}`;
};

const getProfileLinkUrl = (userId, inApplication = false) => {
	return inApplication ? `discord://-/users/${userId}` : `https://discordapp.com/users/${userId}`;
};

const getInviteLinkUrl = (inviteCode, inApplication = false) => {
	return inApplication ? `discord://-/invite/${inviteCode}` : `https://discord.gg/${inviteCode}`;
};

module.exports = {
	getGuildIconUrl,
	getUserIconUrl,
	getInteractionMessageLinkUrl,
	getProfileLinkUrl,
	getInviteLinkUrl,
};
