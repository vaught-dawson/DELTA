async function getMemberFromSheetByName(member, sheet, server) {
	if (member.name == null) {
		return undefined;
	}

	var rows = await sheet.getRows();
	let output = rows.filter((row) => row[server.nameHeader].toLowerCase() === member.name.toLowerCase());

	return output[0];
}

module.exports.getMemberFromSheetByName = getMemberFromSheetByName;
