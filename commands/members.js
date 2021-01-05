const { getMembersInfo } = require('../functions/getMembersInfo.js');
const { loadSpreadsheet } = require('../functions/loadSpreadsheet.js');
const { splitEmbedsByFields } = require('../functions/splitEmbedsByFields.js');

module.exports = {
	name: 'members',
	aliases: [ 'mbrs', 'listmembers', 'lstmbrs', 'list', 'lst' ],
	description: 'Lists all members in a roster.',
	sheets: true,
	usage: '<here?>',
	guildOnly: true,
	commandChannel: true,
	async execute(message, args, server) {
		const spreadsheet = await loadSpreadsheet(server.sheetId);
		var rosterSheet = spreadsheet.sheetsByTitle[server.rosterName];
		var membersInfo = await getMembersInfo(rosterSheet);
		var embeds = await splitEmbedsByFields(membersInfo, 24, spreadsheet.title);

		embeds.forEach((embed) => {
			if (args.length > 0) message.channel.send(embed);
			else message.author.send(embed);
		});

		if (args.length == 0)
			return message.reply(
				`I've sent you a DM with the list of members!\nIf you wanted to display them here, run \`${server.prefix}${this
					.name} here\``
			);
	}
};
