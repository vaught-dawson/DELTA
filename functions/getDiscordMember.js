async function getDiscordMember(inputMember, message) {
	var member = { name: inputMember, id: 'None' };

	if (message.mentions.members.size == 1) {
		member.id = message.mentions.members.first().id;

		try {
			member.name = (await message.guild.members.fetch(member.id)).displayName.split(/ +/).join('_');
		} catch (err) {
			member.name = null;
		}
	} else if (inputMember.length == 18 && !isNaN(inputMember)) {
		member.id = inputMember;

		try {
			member.name = (await message.guild.members.fetch(member.id)).displayName.split(/ +/).join('_');
		} catch (err) {
			member.name = null;
		}
	}

	return member;
}

module.exports.getDiscordMember = getDiscordMember;
