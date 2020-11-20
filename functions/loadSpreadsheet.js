const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('../information/client_secret.json');

async function loadSpreadsheet(spreadsheetId) {
	const spreadsheet = new GoogleSpreadsheet(spreadsheetId);
	try {
		await spreadsheet.useServiceAccountAuth(creds);
	} catch (err) {
		return null;
	}
	await spreadsheet.loadInfo();
	return spreadsheet;
}

module.exports.loadSpreadsheet = loadSpreadsheet;
