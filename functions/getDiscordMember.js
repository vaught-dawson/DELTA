async function getDiscordMember(inputMember, message) {
	var member = { name: inputMember, id: 'None' };

	if (message.mentions.members.size > 0) {
		member.id = message.mentions.members.first().id;

		try {
			let name = (await message.guild.members.fetch(member.id)).displayName.split(/ +/);
			member.name = name[name.length - 1];
		} catch (err) {
			member.name = null;
		}
	} else if (inputMember.length == 18 && !isNaN(inputMember)) {
		member.id = inputMember;

		try {
			let name = (await message.guild.members.fetch(member.id)).displayName.split(/ +/);
			member.name = name[name.length - 1];
		} catch (err) {
			member.name = null;
		}
	}

	return member;
}

module.exports.getDiscordMember = getDiscordMember;
