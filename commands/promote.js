const { getDiscordMember } = require('../functions/getDiscordMember.js');
const { loadSpreadsheet } = require('../functions/loadSpreadsheet.js');
const { sendErrorEmbed } = require('../functions/sendErrorEmbed.js');
const dateFormat = require('dateformat');
const ranks = require('../information/ranks.json');

module.exports = {
	name: 'promote',
	aliases: [ 'pmt', 'promo' ],
	description: 'Promotes a member on the roster.',
	args: true,
	sheets: true,
	usage: '<member name>',
	guildOnly: true,
	commandChannel: true,
	async execute(message, args, server) {
		const spreadsheet = await loadSpreadsheet(server.sheetId);
		const rosterSheet = (await spreadsheet).sheetsByTitle[server.rosterName];
		const rows = await rosterSheet.getRows();
		var inputMember = args.join('_');
		var member = await getDiscordMember(inputMember, message);
		var output;
		rows.forEach((row) => {
			if (
				row[server.nameHeader].toLowerCase() == member.name.toLowerCase() ||
				row[server.discordHeader] == member.id
			) {
				let rank = row[server.rankHeader];
				newRank = promote(rank);
				if (newRank == null) output = `Failed to promote \`${row[server.nameHeader]}\` from \`${rank}\`.`;
				else {
					try {
						row[server.rankHeader] = newRank;
						let lastPromoDate = dateFormat(row[server.lastPromotionDateHeader]);
						let today = dateFormat(new Date(), 'mm/dd/yy');
						row[server.lastPromotionDateHeader] = today;
						if (newRank == '01-PVT') {
							row[server.statusHeader] = 'ACTIVE';
						}
						row.save();
						output = `Successfully promoted \`${row[
							server.nameHeader
						]}\` to \`${newRank}\` from \`${rank}\`.`;
						if (Date.parse(today) - Date.parse(lastPromoDate) < 86400000 * 7) {
							output += `\n\n\`Warning: This user has been promoted within the last week!\``;
						}
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
		case ranks['tr']:
			return ranks['pvt'].toString();
		case ranks['pvt']:
			return ranks['pfc'].toString();
		case ranks['pfc']:
			return ranks['spc'].toString();
		case ranks['spc']:
			return ranks['lcpl'].toString();
		case ranks['lcpl']:
			return ranks['cpl'].toString();
		case ranks['cpl']:
			return ranks['sgt'].toString();
		case ranks['sgt']:
			return ranks['ssgt'].toString();
		case ranks['ssgt']:
			return ranks['msgt'].toString();
		case ranks['msgt']:
			return ranks['sgm'].toString();
		case ranks['sgm']:
			return ranks['wo'].toString();
		case ranks['wo']:
			return ranks['2lt'].toString();
		case ranks['2lt']:
			return ranks['1lt'].toString();
		case ranks['1lt']:
			return ranks['cpt'].toString();
		case ranks['cpt']:
			return ranks['mjr'].toString();
		case ranks['mjr']:
			return ranks['colonel'].toString();
	}
	return null;
}
