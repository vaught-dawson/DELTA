const { loadSpreadsheet } = require('./loadSpreadsheet.js');
const ranks = require('../information/ranks.json');

//Function to grab a member and promote them
async function promoteMember(sheetId, userId, userName) {
	const doc = await loadSpreadsheet(sheetId);
	var sheet = doc.sheetsByTitle['Roster'];
	var rows = await sheet.getRows();
	var rank;
	var newRank = null;
	var output = null;
	var lastPromo;
	rows.forEach((row) => {
		if (row.Name.toLowerCase() == userName.toLowerCase() || row.Discord == userId) {
			lastPromo = row.LastPromo;
			rank = row.Rank;
			newRank = promote(rank);
			if (newRank == null) output = `Failed to promote \`${row.Name}\` from \`${rank}\`.`;
			try {
				row.Rank = newRank;
				if (newRank == '01-PVT') {
					row.Status = 'ACTIVE';
				}
				var today = new Date();
				row.LastPromo = today.toLocaleDateString('en-US');
				row.save();
			} catch (err) {
				console.log(err);
				output = `There was a problem saving to the roster.`;
			}

			if (output == null) {
				output = `Successfully promoted \`${row.Name}\` to \`${newRank}\` from \`${rank}\`.`;
			}

			if (new Date().valueOf() - Date.parse(lastPromo) < 86400000 * 7) {
				output += `\n\n\`Warning: This user has been promoted within the last week!\``;
			}
		}
	});

	if (output == null) {
		output = `Failed to find the member \`${userName}\`.`;
	}
	return output;
}

function promote(rank) {
	switch (rank) {
		case ranks.tr:
			return ranks.pvt.toString();
		case ranks.pvt:
			return ranks.pfc.toString();
		case ranks.pfc:
			return ranks.spc.toString();
		case ranks.spc:
			return ranks.lcpl.toString();
		case ranks.lcpl:
			return ranks.cpl.toString();
		case ranks.cpl:
			return ranks.sgt.toString();
		case ranks.sgt:
			return ranks.ssgt.toString();
		case ranks.ssgt:
			return ranks.msgt.toString();
		case ranks.msgt:
			return ranks.sgm.toString();
	}
	return null;
}

module.exports.promoteMember = promoteMember;
