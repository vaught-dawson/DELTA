const { getMembersFromSheet } = require('./getMembersFromSheet');

async function getMembersInfo(sheet) {
	var rows = await getMembersFromSheet(sheet);
	var output = [];
	rows.forEach((row) => {
		output.push({ name: `${row.Name}`, value: `**Rank:** ${row.Rank}\n**Status:** ${row.Status}`, inline: true });
	});
	return output;
}

module.exports.getMembersInfo = getMembersInfo;
