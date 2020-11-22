async function getDiscordMember(inputMember, message) {
	var member = { name: inputMember, id: null };
	if (message.mentions.members.size == 1) {
		member.id = message.mentions.members.first().id;
		member.name = (await message.guild.members.fetch(member.id)).displayName.split(/ +/).join('_');
	} else if (inputMember.length == 18 && !isNaN(inputMember)) {
		member.id = inputMember;
		member.name = (await message.guild.members.fetch(member.id)).displayName.split(/ +/).join('_');
	}
	return member;
}

module.exports.getDiscordMember = getDiscordMember;
