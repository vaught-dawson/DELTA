const { getDiscordMember } = require('../functions/getDiscordMember.js');
const { getMemberFromSheetById } = require('../functions/getMemberFromSheetById.js');
const { getMemberFromSheetByName } = require('../functions/getMemberFromSheetByName.js');
const { loadSpreadsheet } = require('../functions/loadSpreadsheet.js');
const { sendErrorEmbed } = require('../functions/sendErrorEmbed.js');
const { getReactionConfirmation } = require('../functions/getReactionConfirmation.js');
const dateFormat = require('dateformat');

module.exports = {
	name: 'demote',
	aliases: [ 'dmt', 'demo', 'd' ],
	description: 'Demotes a member on the roster.',
	args: true,
	sheets: true,
	usage: '<member name/id>',
	guildOnly: true,
	commandChannel: true,
	async execute(message, args, server) {
		const spreadsheet = loadSpreadsheet(server.spreadsheetId, server);

		if (spreadsheet === null) {
			return message.channel.send('Invalid spreadsheet id! Make sure you set it up properly in the config.');
		}

		const rosterSheet = (await spreadsheet).sheetsByTitle[server.rosterName];

		var member = await getDiscordMember(args.join('_'), message);

		var memberData = await getMemberFromSheetById(member, rosterSheet, server);
		if (!memberData) {
			memberData = await getMemberFromSheetByName(member, rosterSheet, server);
			if (!memberData) {
				return message.channel.send(
					`Member \`${member.name == null ? member.id : member.name}\` not found on the roster!`
				);
			}
		}

		let previousRank = memberData[server.rankHeader];

		if (!previousRank) {
			return message.channel.send('Invalid rank header! Make sure this is correct in the config.');
		}

		if (!memberData[server.nameHeader]) {
			return message.channel.send('Invalid name header! Make sure this is correct in the config.');
		}

		let newRank = await demote(previousRank, server);

		if (!newRank) {
			return message.channel.send(
				`Failed to demote \`${memberData[server.nameHeader]}\` from \`${memberData[
					server.rankHeader
				]}\`.\n\nAre you using the right rank system?`
			);
		} else if (newRank === null) {
			return message.channel.send(
				'This server has an invalid rank structure set in the config or the member has an invalid rank.\nHave an admin change this with the `setConfig` command!'
			);
		}

		let isConfirmed = await getReactionConfirmation(`Are your sure you want to do this? \n\`${server.memberLogPrefix} ${previousRank.split('-').pop()} ${memberData[
			server.nameHeader
		]} -> ${server.memberLogPrefix} ${newRank.split('-').pop()} ${memberData[server.nameHeader]}\``, message);
		if (!(await isConfirmed)) return;

		let today = dateFormat(new Date(), 'mm/dd/yy', true);

		memberData[server.rankHeader] = newRank;
		memberData[server.lastPromotionDateHeader] = today;

		try {
			const rows = await rosterSheet.getRows();
			var output;

			var foundIndex = rows.findIndex((row) => row[server.discordHeader] == member.id);

			if (foundIndex === -1) {
				foundIndex = rows.findIndex((row) => row[server.nameHeader].toLowerCase() == member.name.toLowerCase());

				if (foundIndex === -1) {
					return message.channel.send(`Failed to find \`${member.name}\` on the roster.`);
				}
			}

			rows[foundIndex] = memberData;
			rows[foundIndex].save();

			output = `Successfully demoted \`${memberData[
				server.nameHeader
			]}\` to \`${newRank}\` from \`${previousRank}\`.`;

			output += `\n\n\`${server.memberLogPrefix} ${previousRank.split('-').pop()} ${memberData[
				server.nameHeader
			]} -> ${server.memberLogPrefix} ${newRank.split('-').pop()} ${memberData[server.nameHeader]}\``;
		} catch (err) {
			sendErrorEmbed(message, { message: `**Command:** ${message.content}\n**Error:** ${err}` });
			output = `There was a problem saving to the roster.`;
		}

		return message.channel.send(output ? output : `Failed to find \`${member.name}\` on the roster.`);
	}
};

async function demote(currentRank, server) {
	try {
		let rankStructure = server.rankStructure;
		const { ranks } = require(`../information/ranks/${rankStructure}.json`);

		let currRank = await ranks.find((r) => r.name == currentRank);

		if (!currRank) {
			throw 'Invalid Rank.';
		}

		let newRank = await ranks.find((r) => r.index == currRank.index - 1);

		if (!newRank) {
			return null;
		}

		return newRank.name;
	} catch (err) {
		console.log(err);
		return null;
	}
}
