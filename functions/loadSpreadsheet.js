const { GoogleSpreadsheet } = require('delta-google-spreadsheet');
const { sendErrorEmbed } = require('../functions/sendErrorEmbed.js');

async function loadSpreadsheet(spreadsheetId, guild) {
	const spreadsheet = new GoogleSpreadsheet(spreadsheetId);

	try {
		await spreadsheet.useServiceAccountAuth(guild['googleClientCredentials']);
	} catch (err) {
		sendErrorEmbed({ message: `**Error:** ${err}` });
		return null;
	}

	await spreadsheet.loadInfo();

	return spreadsheet;
}

module.exports.loadSpreadsheet = loadSpreadsheet;
