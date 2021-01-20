async function isNameOnSheet(name, sheet, server) {
	const rows = await sheet.getRows();
	let isName = false;

	rows.forEach((row) => {
		if (row[server.nameHeader].toLowerCase() == name.toLowerCase()) {
			isName = true;
		}
	});

	return isName;
}

module.exports.isNameOnSheet = isNameOnSheet;
