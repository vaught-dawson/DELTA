const { combineElementsByCharacter } = require('../functions/combineElementsByCharacter.js');
const { getDiscordMember } = require('../functions/getDiscordMember.js');
const { getHeader } = require('../functions/getHeader.js');
const { getSheetHeaders } = require('../functions/getSheetHeaders.js');
const { loadSpreadsheet } = require('../functions/loadSpreadsheet.js');
const { getMemberFromSheetById } = require('../functions/getMemberFromSheetById.js');
const { getMemberFromSheetByName } = require('../functions/getMemberFromSheetByName.js');
const { sendErrorEmbed } = require('../functions/sendErrorEmbed.js');

module.exports = {
	name: 'add',
	aliases: [ 'a' ],
	description: 'Adds a number to a numerical column for a member.',
	args: true,
	sheets: true,
	usage: '<number> <column header> <member name/id>',
	guildOnly: true,
	commandChannel: true,
	async execute(message, args, server) {
		const spreadsheet = loadSpreadsheet(server.spreadsheetId);
		const rosterSheet = (await spreadsheet).sheetsByTitle[server.rosterName];

        args = combineElementsByCharacter(args, '"');
        var inputNumber = args.shift();
		var inputHeader = args.shift();
		var headers = await getSheetHeaders(rosterSheet);
        var header = await getHeader(headers, inputHeader);
        
        if (isNaN(inputNumber)) {
            return message.channel.send('Invalid input number!');
        }

		if (!header) {
			return message.channel.send('Invalid column header!');
        }
        
		var inputMember = args.shift();
		var member = await getDiscordMember(inputMember, message);

		var memberData = await getMemberFromSheetById(member, rosterSheet, server);

		if (!memberData) {
			memberData = await getMemberFromSheetByName(member, rosterSheet, server);

			if (!memberData) {
				return message.channel.send(
					`Member \`${member.name == null ? member.id : member.name}\` not found on the roster!`
				);
			}
        }
        
		let currentNumberValue = memberData[header];
		
		if (!currentNumberValue) {
			currentNumberValue = 0;
		}

        if (isNaN(currentNumberValue)) {
            return message.channel.send('This is not a numerical column!');
		}

		let memberName = memberData[server.nameHeader];
        
		let addedNumberTotal = parseInt(currentNumberValue) + parseInt(inputNumber)
		
		if (!addedNumberTotal) {
			addedNumberTotal = 0;
		}

        if (addedNumberTotal === NaN) {
            addedNumberTotal = inputNumber;
        }

		memberData[header] = addedNumberTotal;

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

			output = `Successfully changed \`${header}\` for \`${memberName}\` from \`${currentNumberValue
				? currentNumberValue
				: 'Undefined'}\` to \`${addedNumberTotal}\`.`;
		} catch (err) {
			sendErrorEmbed(message, { message: `**Command:** ${message.content}\n**Error:** ${err}` });
			output = `There was a problem saving to the roster.`;
		}

		return message.channel.send(output);
	}
};
