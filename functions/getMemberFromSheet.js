async function getMemberFromSheet(member, sheet, server) {
	var rows = await sheet.getRows();
	let output;
	rows.forEach((row) => {
		if (row[server.nameHeader].toLowerCase() == member.name.toLowerCase() || row[server.discordHeader] == member.id) {
			output = row;
		}
	});
	return output;
}

module.exports.getMemberFromSheet = getMemberFromSheet;
