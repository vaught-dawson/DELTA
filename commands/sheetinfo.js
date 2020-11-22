const { getSheetInfo } = require('../functions/getSheetInfo.js');
const { loadSpreadsheet } = require('../functions/loadSpreadsheet.js');
const { splitEmbedsByFields } = require('../functions/splitEmbedsByFields');

module.exports = {
	name: 'sheetinfo',
	aliases: [ 'sheet' ],
	description: "Gets a roster sheet's info.",
	args: true,
	sheets: true,
	usage: '<sheet name>',
	guildOnly: true,
	async execute(message, args, server) {
		const spreadsheet = loadSpreadsheet(server.sheetId);
		const sheet = (await spreadsheet).sheetsByTitle[args.join(' ')];
		if (!sheet)
			return message.channel.send(
				`Could not find the sheet \`${args[0]}\`!\n\n\`Sheet names are CaSe-Sensitive. Make sure you typed it the same as it is in the spreadsheetInfo command!\``
			);
		try {
			message.channel.send(splitEmbedsByFields(await getSheetInfo(sheet), 24, sheet.title));
		} catch (err) {
			console.log(err);
			await sendErrorEmbed(message, { message: `**Command:** ${message.content}\n**Error:** ${err}` });
			return message.channel.send(`Failed to grab the sheet.`);
		}
	}
};
