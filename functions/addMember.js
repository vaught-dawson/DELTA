const { loadDocument } = require('./loadDocument.js');
const { isNameOnSheet } = require('./isNameOnSheet.js');

//Function to add a member to the roster
async function addMember(sheetId, userId, userName) {
	const doc = await loadDocument(sheetId), sheet = doc.sheetsByTitle['Roster'];
	if (userId == 'name') userId = null;
	if (await isNameOnSheet(userName, sheetId)) return `This name is already in use!`;
	await sheet
		.addRow({
			Name: userName,
			Rank: '-01-TR',
			Status: 'ACTIVE',
			Discord: userId || 'None',
			Currency: 0
		})
		.catch((err) => {
			return `Failed to add \`${userName}\` to the roster.`;
		});
	return `Successfully added \`${userName}\` to the roster.`;
}

module.exports.addMember = addMember;
