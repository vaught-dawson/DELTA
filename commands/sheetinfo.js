const { getSheetInfo } = require('../functions/getSheetInfo.js');
const { loadSpreadsheet } = require('../functions/loadSpreadsheet.js');
const { splitEmbedsByFields } = require('../functions/splitEmbedsByFields');

module.exports = {
	name: 'sheetinfo',
	aliases: [ 'sheet' ],
	description: "Gets a sheet's basic info.",
	args: true,
	sheets: true,
	usage: '<sheet name>',
	guildOnly: true,
	commandChannel: true,
	async execute(message, args, server) {
		let inputSheetName = args.join(' ');
		let outputSheetName;
		const spreadsheet = await loadSpreadsheet(server.spreadsheetId);
		if (spreadsheet === null) 
			return message.channel.send('Invalid spreadsheet id! Make sure you set it up properly in the config.');
		for (let i = 0; i < spreadsheet.sheetCount; i++) {
			if (spreadsheet.sheetsByIndex[i].title.toLowerCase() == inputSheetName.toLowerCase()) {
				outputSheetName = spreadsheet.sheetsByIndex[i].title;
				i = spreadsheet.sheetCount;
			}
		}
		const sheet = spreadsheet.sheetsByTitle[outputSheetName];
		if (!sheet)
			return message.channel.send(
				`Could not find the sheet \`${inputSheetName}\`!`
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
