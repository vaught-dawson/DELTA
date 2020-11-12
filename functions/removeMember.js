const { loadDocument } = require('./loadDocument.js');

//Function to remove a member from the roster
async function removeMember(sheetId, userId, userName) {
	const doc = await loadDocument(sheetId);
	var sheet = doc.sheetsByTitle['Roster'];
	var rows = await sheet.getRows();
	var index = -1;
	rows.forEach((row) => {
		if (row.Name.toLowerCase() == userName.toLowerCase() || row.Discord == userId)
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
			return `Successfully removed \`${userName}\` from the roster.`;
		} catch (err) {
			console.error(err);
			return 'Failed to remove user from the roster.';
		}
	}
	return `Could not find \`${userName}\` on the roster.`;
}

function startTimer() {
	return console.log('Running');
}
module.exports.removeMember = removeMember;
