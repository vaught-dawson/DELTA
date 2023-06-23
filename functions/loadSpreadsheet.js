const { GoogleSpreadsheet } = require('delta-google-spreadsheet');
const { sendErrorEmbed } = require('../functions/sendErrorEmbed.js');
const creds = require('../information/google_secret.json');

async function loadSpreadsheet(spreadsheetId) {
	const spreadsheet = new GoogleSpreadsheet(spreadsheetId);

	try {
		await spreadsheet.useServiceAccountAuth(creds);
	} catch (err) {
		sendErrorEmbed({ message: `**Error:** ${err}` });
		return null;
	}

	await spreadsheet.loadInfo();

	return spreadsheet;
}

module.exports.loadSpreadsheet = loadSpreadsheet;
