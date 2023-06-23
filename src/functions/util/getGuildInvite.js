const getGuildInvite = async (guild) => {
	const invites = await guild.invites.fetch();
	return invites.keys().next().value;
};

module.exports = { getGuildInvite };
