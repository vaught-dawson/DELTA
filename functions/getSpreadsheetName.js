const { loadDocument } = require('./loadDocument.js');

//Function to get the spreadsheet's name
async function getSpreadsheetName(sheetId) {
	const doc = await loadDocument(sheetId);
	return doc.title.toString();
}

module.exports.getSpreadsheetName = getSpreadsheetName;
