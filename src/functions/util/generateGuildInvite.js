const generateGuildInvite = async (guild, channelId) => {
	const invite = await guild.invites.create(channelId, {
		temporary: true,
		maxAge: 7 * 24 * 60 * 60,
		maxUses: 1,
		unique: true,
		reason: "DELTA Developer Invite to inspect bug from bug report.",
	});
	return invite;
};

module.exports = { generateGuildInvite };
