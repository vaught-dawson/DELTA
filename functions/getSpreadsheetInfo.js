const { loadDocument } = require('./loadDocument.js');

//Function to get spreadsheet info in an embed-ready array
async function getSpreadsheetInfo(sheetId) {
	const doc = await loadDocument(sheetId);
	var output = [];
	for (var i = 0; i < doc.sheetCount; i++) {
		var sheet = doc.sheetsByIndex[i];
		output.push({ name: `Sheet: ${sheet.title}`, value: `**Rows:** ${sheet.rowCount}`, inline: true });
	}
	return output;
}

module.exports.getSpreadsheetInfo = getSpreadsheetInfo;
