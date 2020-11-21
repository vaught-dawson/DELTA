async function addMemberToSheet(member, sheet) {
	await sheet.addRow({
		Name: member.name,
		Rank: '-01-TR',
		Status: 'ACTIVE',
		Discord: member.id || 'None',
		Currency: 0
	});
}

module.exports.addMemberToSheet = addMemberToSheet;
