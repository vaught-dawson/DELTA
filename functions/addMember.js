const { loadDocument } = require('./loadDocument.js');

//Function to add a member to the roster
async function addMember(sheetId, userId, userName) {
	const doc = await loadDocument(sheetId);
	var sheet = doc.sheetsByTitle['Roster'];
	if (userId == 'name') userId = null;
	await sheet
		.addRow({
			Name: userName,
			Rank: '-01-TR',
			Status: 'ACTIVE',
			Discord: userId || 'None'
		})
		.catch((err) => {
			return `Failed to add \`${userName}\` to the roster.`;
		});
	return `Successfully added \`${userName}\` to the roster.`;
}

module.exports.addMember = addMember;
