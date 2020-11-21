async function isNameOnSheet(name, sheet) {
	const rows = await sheet.getRows();
	let isName = false;
	rows.forEach((row) => {
		if (row.Name.toLowerCase() == name.toLowerCase()) isName = true;
	});
	return isName;
}

module.exports.isNameOnSheet = isNameOnSheet;
