const { loadSpreadsheet } = require('./loadSpreadsheet.js');
const ranks = require('../information/ranks.json');

//Function to grab a member and promote them
async function demoteMember(sheetId, userId, userName) {
	const doc = await loadSpreadsheet(sheetId);
	var sheet = doc.sheetsByTitle['Roster'];
	var rows = await sheet.getRows();
	var rank;
	var newRank = null;
	var output = null;
	rows.forEach((row) => {
		if (row.Name.toLowerCase() == userName.toLowerCase() || row.Discord == userId) {
			rank = row.Rank;
			newRank = demote(rank);
			if (newRank == null)
				output = `Failed to demote \`${row.Name}\` from \`${rank}\`\nWO+ demotions have to be manual to avoid hiccups.`;
			try {
				row.Rank = newRank;
				row.save();
			} catch (err) {
				console.log(err);
				output = `There was a problem saving to the roster.`;
			}
			if (output == null) {
				output = `Successfully demoted \`${row.Name}\` to \`${newRank}\` from \`${rank}\`.`;
			}
		}
	});

	if (output == null) {
		output = `Failed to find the member \`${userName}\`.`;
	}
	return output;
}

function demote(rank) {
	switch (rank) {
		case ranks.pfc:
			return ranks.pvt.toString();
		case ranks.spc:
			return ranks.pfc.toString();
		case ranks.lcpl:
			return ranks.spc.toString();
		case ranks.cpl:
			return ranks.lcpl.toString();
		case ranks.sgt:
			return ranks.cpl.toString();
		case ranks.ssgt:
			return ranks.sgt.toString();
		case ranks.msgt:
			return ranks.ssgt.toString();
		case ranks.sgm:
			return ranks.msgt.toString();
	}
	return null;
}

module.exports.demoteMember = demoteMember;
