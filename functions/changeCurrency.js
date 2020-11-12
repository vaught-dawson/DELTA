const { loadDocument } = require('./loadDocument.js');

//Function to change a member's currency
async function changeCurrency(sheetId, userId, userName, monetaryChange) {
	const doc = await loadDocument(sheetId);
	var sheet = doc.sheetsByTitle['Roster'];
	var rows = await sheet.getRows();
	var output = null;
	rows.forEach((row) => {
		if (row.Name.toLowerCase() == userName.toLowerCase() || row.Discord == userId) {
			if (isNaN(monetaryChange)) output = `Invalid monetary change amount. Make sure you input a number!`;

			if (output == null) {
				try {
					row.Currency = parseInt(monetaryChange) + parseInt(row.Currency);
					row.save();
				} catch (err) {
					console.log(err);
					output = `There was a problem saving to the roster.`;
				}
				if (output == null) {
					output = `Successfully changed the currency of \`${row.Name}\` by \`${monetaryChange}\`. Their balance is now \`${row.Currency}\``;
				}
			}
		}
	});

	if (output == null) {
		output = `Failed to find the member \`${userName}\``;
	}
	return output;
}

module.exports.changeCurrency = changeCurrency;
