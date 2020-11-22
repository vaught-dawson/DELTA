async function getSpreadsheetInfo(spreadsheet) {
	var output = [];
	for (var i = 0; i < spreadsheet.sheetCount; i++) {
		var sheet = spreadsheet.sheetsByIndex[i];
		output.push({ name: `Sheet: ${sheet.title}`, value: `**Rows:** ${sheet.rowCount}`, inline: true });
	}
	return output;
}

module.exports.getSpreadsheetInfo = getSpreadsheetInfo;
