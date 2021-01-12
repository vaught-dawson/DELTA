async function addMemberToSheet(member, sheet) {
	await sheet.addRow({
		Name: member.name,
		Discord: member.id || 'None',
	});
}

module.exports.addMemberToSheet = addMemberToSheet;
