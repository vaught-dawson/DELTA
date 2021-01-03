const { combineElementsByCharacter } = require('../functions/combineElementsByCharacter.js');
const { getDiscordMember } = require('../functions/getDiscordMember.js');
const { getHeader } = require('../functions/getHeader.js');
const { getSheetHeaders } = require('../functions/getSheetHeaders.js');
const { loadSpreadsheet } = require('../functions/loadSpreadsheet.js');

module.exports = {
	name: 'set',
	aliases: [ 'set' ],
	description: 'Sets data of members.',
	args: true,
	sheets: true,
	usage: '<column header> <member> <data>',
	guildOnly: true,
	async execute(message, args, server) {
		const spreadsheet = loadSpreadsheet(server.sheetId);
		const rosterSheet = (await spreadsheet).sheetsByTitle[server.rosterName];
		args = combineElementsByCharacter(args, '"');
		var inputHeader = args.shift();
		var headers = await getSheetHeaders(rosterSheet);
		var header = await getHeader(headers, inputHeader)
		if (!header)
			return message.channel.send('Invalid column header!');
		var inputMember = args.shift();
		var member = await getDiscordMember(inputMember, message);
		var data = args.join(' ');
		var output = null;

		(await rosterSheet.getRows()).forEach((row) => {
			if (row[server.nameHeader].toLowerCase() == member.name.toLowerCase() || row[server.discordHeader] == member.id) {
				member.name = row[server.nameHeader];
				row[header] = data;
				row.save();
				return (output = `Successfully changed \`${header}\` for \`${member.name}\` to \`${data}\`.`);
			}
		});

		if (output == null) {
			output = `Could not find member \`${inputMember}\` on the roster!`;
		}

		return message.channel.send(output);
	}
};
