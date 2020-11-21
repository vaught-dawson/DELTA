const { getDiscordMember } = require('../functions/getDiscordMember.js');
const { getMemberInfo } = require('../functions/getMemberInfo.js');
const { addMemberToSheet } = require('../functions/addMemberToSheet.js');
const { removeMemberFromSheet } = require('../functions/removeMemberFromSheet.js');
const { sendErrorEmbed } = require('../functions/sendErrorEmbed.js');
const { loadSpreadsheet } = require('../functions/loadSpreadsheet.js');
const { isNameOnSheet } = require('../functions/isNameOnSheet.js');

module.exports = {
	name: 'member',
	aliases: [ 'mbr' ],
	description: 'Manage members.',
	args: true,
	sheets: true,
	usage: '<add/remove/info> <member name>',
	guildOnly: true,
	async execute(message, args, server) {
		if (args.length <= 1 || args == undefined)
			return message.channel.send(`Invalid Arguments! Usage: \`${server.prefix}${this.name} ${this.usage}\``);
		var subcommand = args.shift().toLowerCase();
		var inputMember = args.join('_');
		if (inputMember.length > 256)
			return message.channel.send('Name is too long! The name field maxes out at `256` characters.');
		var member = await getDiscordMember(inputMember, message);
		const doc = await loadSpreadsheet(server.sheetId);
		var sheet = doc.sheetsByTitle['Roster'];
		try {
			switch (subcommand) {
				case 'add':
					if (await isNameOnSheet(member.name, sheet))
						return message.channel.send(`This name is already in use!`);
					await addMemberToSheet(member, sheet);
					return message.channel.send(`Successfully added \`${member.name}\` to the roster.`);
				case 'remove':
					await removeMemberFromSheet(member, sheet);
					return message.channel.send(`Successfully removed \`${member.name}\` from the roster.`);
				case 'info':
					return message.channel.send(await getMemberInfo(member, sheet));
				default:
					return message.channel.send(
						`Invalid arguments! \nUsage: \`${server.prefix}${this.name} ${this.usage}\``
					);
			}
		} catch (err) {
			console.log(err);
			await sendErrorEmbed(message, { message: `Error: ${err.name}\n\nMessage: ${err.message}` });
			return message.channel.send(`Failed to run \`${subcommand}\` on \`${member.name}\`.`);
		}
	}
};
