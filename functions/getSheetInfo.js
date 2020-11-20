const { loadSpreadsheet } = require('./loadSpreadsheet.js');

//Function to get spreadsheet info in an embed-ready array
async function getSheetInfo(sheetName, sheetId) {
	const doc = await loadSpreadsheet(sheetId);
	try {
		var sheet = doc.sheetsByTitle[sheetName];
	} catch (err) {
		return null;
	}
	if (sheet == undefined) return null;
	var info = [ sheet.title, sheet.rowCount ];
	return info;
}

module.exports.getSheetInfo = getSheetInfo;
