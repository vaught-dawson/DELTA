const { loadSpreadsheet } = require('../functions/loadSpreadsheet.js');
const { getDiscordMember } = require('../functions/getDiscordMember.js');
const { sendErrorEmbed } = require('../functions/sendErrorEmbed.js');
const ranks = require('../information/ranks.json');

module.exports = {
	name: 'promote',
	aliases: [ 'pmt', 'promo' ],
	description: 'Promotes a member on the roster (Up to SGM).',
	args: true,
	sheets: true,
	usage: '<member name>',
	guildOnly: true,
	async execute(message, args, server) {
		const spreadsheet = loadSpreadsheet(server.sheetId);
		const rosterSheet = (await spreadsheet).sheetsByTitle['Roster'];
		const rows = await rosterSheet.getRows();
		var inputMember = args.join('_');
		var member = await getDiscordMember(inputMember, message);
		var output;
		rows.forEach((row) => {
			if (row['Name'].toLowerCase() == member.name.toLowerCase() || row['Discord'] == member.id) {
				let rank = row['Rank'];
				newRank = promote(rank);
				if (newRank == null)
					output = `Failed to promote \`${row[
						'Name'
					]}\` from \`${rank}\`\nWO+ promotions have to be set manually with the \`set\` command to avoid hiccups.`;
				else {
					try {
						row['Rank'] = newRank;
						row.save();
						output = `Successfully promoted \`${row['Name']}\` to \`${newRank}\` from \`${rank}\`.`;
					} catch (err) {
						sendErrorEmbed(message, { message: `**Command:** ${message.content}\n**Error:** ${err}` });
						output = `There was a problem saving to the roster.`;
					}
				}
			}
		});
		return message.channel.send(output ? output : `Failed to find \`${member.name}\` on the roster.`);
	}
};

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
