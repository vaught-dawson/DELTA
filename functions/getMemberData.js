const { loadSpreadsheet } = require('./loadSpreadsheet.js');
const Discord = require('discord.js');

//Function to return an embed with member's data
async function getMemberData(sheetId, userId, userName) {
	const doc = await loadSpreadsheet(sheetId);
	var sheet = doc.sheetsByTitle['Roster'];
	var rows = await sheet.getRows();
	var embed, subdivDate, lastPromoDate, discordId, steamId, rank, status, name, currency;
	rows.forEach((row) => {
		if (row.Name.toLowerCase() == userName.toLowerCase() || row.Discord == userId) {
			name = row.Name || 'None';
			subdivDate = row.SubDiv || 'None';
			lastPromoDate = row.LastPromo || 'None';
			discordId = row.Discord || 'None';
			steamId = row.Steam || 'None';
			rank = row.Rank || 'None';
			status = row.Status || 'None';
			currency = row.Currency || '0';
			embed = new Discord.MessageEmbed({
				thumbnail: { url: 'https://i.ibb.co/2MHY6wn/D-E-L-T-A-4.jpg' },
				color: 15105570,
				title: name,
				description: `**Rank:** ${rank}\n**Status:** ${status}\n**Last Promotion:** ${lastPromoDate}\n\
                **Date Joined:** ${subdivDate}\n**Steam:** ${steamId}\n**Discord:** ${discordId}\n**Currency:** ${currency}`,
				footer: {
					text: 'Resistance Logistics',
					icon_url: 'https://i.ibb.co/Wzd001F/677a08d8682923ca8cb51fe48df38208.png'
				}
			});
		}
	});
	if (!embed) return `Could not find member: ${userName}`;
	return embed;
}

module.exports.getMemberData = getMemberData;
