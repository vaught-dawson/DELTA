const { getSpreadsheetInfo } = require('../functions/getSpreadsheetInfo.js');
const { loadSpreadsheet } = require('../functions/loadSpreadsheet.js');
const { splitEmbedsByFields } = require('../functions/splitEmbedsByFields');

module.exports = {
	name: 'spreadsheetinfo',
	aliases: [ 'sheets' ],
	description: 'Get the info of the whole spreadsheet.',
	args: false,
	sheets: true,
	guildOnly: true,
	commandChannel: true,
	async execute(message, args, server) {
		const spreadsheet = await loadSpreadsheet(server.sheetId);
		try {
			message.channel.send(splitEmbedsByFields(await getSpreadsheetInfo(spreadsheet), 24, spreadsheet.title));
		} catch (err) {
			console.log(err);
			await sendErrorEmbed(message, { message: `**Command:** ${message.content}\n**Error:** ${err}` });
			return message.channel.send(`Failed to grab the spreadsheet.`);
		}
	}
};
