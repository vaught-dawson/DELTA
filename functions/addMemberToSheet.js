async function addMemberToSheet(member, sheet, server) {
	let row = {};
	row[server.nameHeader] = member.name;
	row[server.discordHeader] = member.id || 'None';
	await sheet.addRow(row);
}

module.exports.addMemberToSheet = addMemberToSheet;
