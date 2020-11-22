const { getSheetHeaders } = require('./getSheetHeaders.js');

async function getSheetInfo(sheet) {
	var output = [];
	output.push({ name: 'Id:', value: sheet.sheetId });
	output.push({ name: 'Rows:', value: sheet.rowCount });
	output.push({ name: 'Columns:', value: sheet.columnCount });
	output.push({ name: 'Type:', value: sheet.sheetType });
	let headers = await getSheetHeaders(sheet);
	output.push({ name: 'Headers:', value: headers.join(', ') });
	return output;
}

module.exports.getSheetInfo = getSheetInfo;
