const { getMemberFromSheet } = require('./getMemberFromSheet.js');
const { getSheetHeaders } = require('./getSheetHeaders.js');
const Discord = require('discord.js');

async function getMemberInfo(member, sheet, server) {
	var memberData = await getMemberFromSheet(member, sheet, server);
	if (!memberData) return `Member \`${member.name}\` not found!`;
	var headers = await getSheetHeaders(sheet);
	const embed = new Discord.MessageEmbed({
		thumbnail: { url: 'https://i.ibb.co/2MHY6wn/D-E-L-T-A-4.jpg' },
		color: 15105570,
		title: memberData[server.nameHeader],
		footer: {
			text: 'Resistance Logistics',
			icon_url: 'https://i.ibb.co/Wzd001F/677a08d8682923ca8cb51fe48df38208.png'
		}
	});
	let description = '';
	headers.forEach((header) => {
		if (memberData[header] != '' && memberData[header] && header != server.nameHeader)
			description += `**${header}:** ${memberData[header]}\n`;
	});
	if (description != '') embed.setDescription(description);
	else return `No data!`;
	return embed;
}

module.exports.getMemberInfo = getMemberInfo;
