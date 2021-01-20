const { getMembersFromSheet } = require('./getMembersFromSheet');

async function getMembersInfo(sheet, server) {
	var rows = await getMembersFromSheet(sheet);
	var output = [];

	rows.forEach((row) => {
		output.push({
			name: `${row[server.nameHeader]}`,
			value: `**Rank:** ${row[server.rankHeader]}\n**Status:** ${row[server.statusHeader]}`,
			inline: true
		});
	});

	return output;
}

module.exports.getMembersInfo = getMembersInfo;
