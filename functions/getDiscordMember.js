async function getDiscordMember(inputMember, message) {
	var member = { name: inputMember, id: 'None' };

	if (member.name.startsWith('<@!') && member.name.endsWith('>')) {
		member.name = inputMember.substring(3, inputMember.length - 1);
	} else if (member.name.startsWith('<@') && member.name.endsWith('>')) {
		member.name = inputMember.substring(2, inputMember.length - 1);
	}

	if (member.name.length == 18 && !isNaN(member.name)) {
		member.id = member.name;

		let name = (await message.guild.members.fetch(member.id)).displayName.split(/ +/).join('_');
		member.name = name;
	}

	return member;
}

module.exports.getDiscordMember = getDiscordMember;
