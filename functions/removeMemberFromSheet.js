async function removeMemberFromSheet(member, sheet) {
	var rows = await sheet.getRows();
	var index = -1;
	rows.forEach((row) => {
		if (row['Name'].toLowerCase() == member.name.toLowerCase() || row['Discord'] == member.id)
			return (index = row.rowIndex - 2);
	});
	if (index != -1) {
		try {
			await rows[index].delete();
			await new Promise((resolve) =>
				setTimeout(function() {
					resolve();
				}, 2000)
			);
			await sheet.resize({ rowCount: sheet.rowCount - 1, columnCount: sheet.columnCount });
			return `Successfully removed \`${member.name}\` from the roster.`;
		} catch (err) {
			console.error(err);
			return `Failed to remove ${member.name} from the roster.`;
		}
	}
	return `Could not find \`${member.name}\` on the roster.`;
}
module.exports.removeMemberFromSheet = removeMemberFromSheet;
