const { getMembersFromSheet } = require('./getMembersFromSheet');

async function getColumnInfo(sheet, column, server) {
	var rows = await getMembersFromSheet(sheet);
	var output = [];

	rows.forEach((row) => {
		if (row[server.nameHeader] != '') {
			output.push({
				name: `*${row[server.nameHeader]}*`,
				value: `**${column}:** ${row[column]}`,
				inline: true
			});
		}
	});

	return output;
}

module.exports.getColumnInfo = getColumnInfo;
