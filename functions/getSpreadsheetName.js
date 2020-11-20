const { loadSpreadsheet } = require('./loadSpreadsheet.js');

//Function to get the spreadsheet's name
async function getSpreadsheetName(sheetId) {
	const doc = await loadSpreadsheet(sheetId);
	return doc.title.toString();
}

module.exports.getSpreadsheetName = getSpreadsheetName;
