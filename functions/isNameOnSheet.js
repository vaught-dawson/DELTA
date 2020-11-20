const { loadSpreadsheet } = require('./loadSpreadsheet.js');

//Function to get the spreadsheet's name
async function isNameOnSheet(name, sheetId) {
	const doc = await loadSpreadsheet(sheetId), sheet = doc.sheetsByTitle['Roster'], rows = await sheet.getRows();
	let isName = false;
	rows.forEach((row) => {
		if (row.Name.toLowerCase() == name.toLowerCase()) isName = true;
	})
	return isName;
}

module.exports.isNameOnSheet = isNameOnSheet;
