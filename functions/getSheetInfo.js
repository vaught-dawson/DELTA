const { getSheetHeaders } = require('./getSheetHeaders.js');

async function getSheetInfo(sheet) {
	var output = [];

	output.push({ name: 'Id:', value: sheet.spreadsheetId, inline: true });
	output.push({ name: 'Rows:', value: sheet.rowCount, inline: true });
	output.push({ name: 'Columns:', value: sheet.columnCount, inline: true });
	output.push({ name: 'Type:', value: sheet.sheetType, inline: true });

	let headers = await getSheetHeaders(sheet);
	output.push({ name: 'Headers:', value: headers.join(', '), inline: false });

	return output;
}

module.exports.getSheetInfo = getSheetInfo;
