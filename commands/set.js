const { loadSpreadsheet } = require('../functions/loadSpreadsheet.js');
const { isSheetHeader } = require('../functions/isSheetHeader.js');
const { combineElementsByCharacter } = require('../functions/combineElementsByCharacter.js');
const { getDiscordMember } = require('../functions/getDiscordMember.js');

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
		const rosterSheet = (await spreadsheet).sheetsByTitle['Roster'];
		var columnHeader = args.shift();
		if (!await isSheetHeader(columnHeader, rosterSheet))
			return message.channel.send('Invalid column header! \n\n`Warning: Column headers are CaSe-sensitive!`');
		args = combineElementsByCharacter(args, '\"');
		var inputMember = args.shift();
		var member = await getDiscordMember(inputMember, message);
		var data = args.join(' ');
		var output = null;

		(await rosterSheet.getRows()).forEach(row => {
			if (row['Name'].toLowerCase() == member.name.toLowerCase() || row['Discord'] == member.id) {
				row[columnHeader] = data;
				row.save();
				return output = `Successfully changed \`${columnHeader}\` for \`${member.name}\` to \`${data}\`.`
			}
		});

		if (output == null) {
			output = `Could not find member \`${inputMember}\` on the roster!`;
		}
		
		return message.channel.send(output);
	}
};
