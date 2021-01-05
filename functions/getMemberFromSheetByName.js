async function getMemberFromSheetByName(member, sheet, server) {
	var rows = await sheet.getRows();
    let output = rows.filter((row) => row[server.nameHeader].toLowerCase() === member.name.toLowerCase());
	return output[0];
}

module.exports.getMemberFromSheetByName = getMemberFromSheetByName;

