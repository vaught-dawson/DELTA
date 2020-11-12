const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('../information/client_secret.json');

//Function to properly load a Google Spreadsheet document by id
async function loadDocument(documentId) {
	const doc = new GoogleSpreadsheet(documentId);
	try {
		await doc.useServiceAccountAuth(creds);
	} catch (err) {
		return null;
	}
	await doc.loadInfo();
	return doc;
}

module.exports.loadDocument = loadDocument;
