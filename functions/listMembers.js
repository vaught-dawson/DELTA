const { loadSpreadsheet } = require('./loadSpreadsheet.js');

//Function to list members in an embed-ready array
async function listMembers(sheetId) {
	const doc = await loadSpreadsheet(sheetId);
	var sheet = doc.sheetsByTitle['Roster'];
	var rows = await sheet.getRows();
	var output = [];
	rows.forEach((row) => {
		output.push({ name: `${row.Name}`, value: `**Rank:** ${row.Rank}\n**Status:** ${row.Status}`, inline: true });
	});
	return output;
}

module.exports.listMembers = listMembers;
