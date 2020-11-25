async function getMemberFromSheet(member, sheet) {
	var rows = await sheet.getRows();
	let output;
	rows.forEach((row) => {
		if (row['Name'].toLowerCase() == member.name.toLowerCase() || row['Discord'] == member.id) {
			output = row;
		}
	});
	return output;
}

module.exports.getMemberFromSheet = getMemberFromSheet;
