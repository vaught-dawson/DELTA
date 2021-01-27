async function getMembersFromSheet(sheet) {
	let rows = await sheet.getRows();
	return await rows;
}

module.exports.getMembersFromSheet = getMembersFromSheet;
