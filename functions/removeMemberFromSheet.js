async function removeMemberFromSheet(member, sheet, server) {
	var rows = await sheet.getRows();

	let memberIndex = rows.findIndex((row) => row[server.discordHeader] == member.id);

	if (memberIndex === -1) {
		memberIndex = rows.findIndex((row) => row[server.nameHeader].toLowerCase() == member.name.toLowerCase());

		if (memberIndex === -1) {
			return `Failed to find \`${member.name}\` on the roster.`;
		}
	}
	try {
		await sheet.deleteDimension('ROWS', {
			startIndex: memberIndex + 1,
			endIndex: memberIndex + 2
		});

		return `Successfully removed \`${member.name == null ? member.id : member.name}\` from the roster.`;
	} catch (err) {
		console.error(err);
		return `Failed to remove ${member.name == null ? member.id : member.name} from the roster.`;
	}
}
module.exports.removeMemberFromSheet = removeMemberFromSheet;
