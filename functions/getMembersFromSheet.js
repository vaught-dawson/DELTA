async function getMembersFromSheet(sheet) {
	return (rows = await sheet.getRows());
}

module.exports.getMembersFromSheet = getMembersFromSheet;
