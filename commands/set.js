const { combineElementsByCharacter } = require('../functions/combineElementsByCharacter.js');
const { getDiscordMember } = require('../functions/getDiscordMember.js');
const { getHeader } = require('../functions/getHeader.js');
const { getSheetHeaders } = require('../functions/getSheetHeaders.js');
const { loadSpreadsheet } = require('../functions/loadSpreadsheet.js');
const { getMemberFromSheetById } = require('../functions/getMemberFromSheetById.js');
const { getMemberFromSheetByName } = require('../functions/getMemberFromSheetByName.js');
const { sendErrorEmbed } = require('../functions/sendErrorEmbed.js');

module.exports = {
	name: 'set',
	aliases: [ 'set' ],
	description: 'Sets data of members.',
	args: true,
	sheets: true,
	usage: '<column header> <member name/id> <data>',
	guildOnly: true,
	commandChannel: true,
	async execute(message, args, server) {
		const spreadsheet = loadSpreadsheet(server.spreadsheetId);
		const rosterSheet = (await spreadsheet).sheetsByTitle[server.rosterName];

		args = combineElementsByCharacter(args, '"');
		var inputHeader = args.shift();
		var headers = await getSheetHeaders(rosterSheet);
		var header = await getHeader(headers, inputHeader);

		if (!header) {
			return message.channel.send('Invalid column header!');
		}

		var inputMember = args.shift();
		try {
			var member = await getDiscordMember(inputMember, message);
		} catch (err) {
			console.log(err);
			return message.channel.send('Unknown user! Make sure you typed in a user id.');
		}

		var data = args.join(' ');
		var dataMember;
		try {
			dataMember = await getDiscordMember(data, message);
		} catch (err) {
			return;
		}

		if (dataMember) {
			if (dataMember.id != 'None') {
				data = dataMember.id;
			} 
		}

		var memberData = await getMemberFromSheetById(member, rosterSheet, server);

		if (!memberData) {
			memberData = await getMemberFromSheetByName(member, rosterSheet, server);

			if (!memberData) {
				return message.channel.send(
					`Member \`${member.name == null ? member.id : member.name}\` not found on the roster!`
				);
			}
		}

		let memberName = memberData[server.nameHeader];
		let oldData = memberData[header];
		memberData[header] = data;

		let output;
		try {
			const rows = await rosterSheet.getRows();
			var foundIndex = rows.findIndex((row) => row[server.discordHeader] == member.id);

			if (foundIndex === -1) {
				foundIndex = rows.findIndex((row) => row[server.nameHeader].toLowerCase() == member.name.toLowerCase());

				if (foundIndex === -1) {
					return message.channel.send(`Failed to find \`${member.name}\` on the roster.`);
				}
			}

			rows[foundIndex] = memberData;
			rows[foundIndex].save();

			output = `Successfully changed \`${header}\` for \`${memberName}\` from \`${oldData
				? oldData
				: 'Undefined'}\` to \`${data}\`.`;
		} catch (err) {
			sendErrorEmbed(message, { message: `**Command:** ${message.content}\n**Error:** ${err}` });
			output = `There was a problem saving to the roster.`;
		}

		return message.channel.send(output);
	}
};
