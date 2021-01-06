const { addMemberToSheet } = require('../functions/addMemberToSheet.js');
const { getDiscordMember } = require('../functions/getDiscordMember.js');
const { getMemberInfo } = require('../functions/getMemberInfo.js');
const { isNameOnSheet } = require('../functions/isNameOnSheet.js');
const { loadSpreadsheet } = require('../functions/loadSpreadsheet.js');
const { removeMemberFromSheet } = require('../functions/removeMemberFromSheet.js');
const { sendErrorEmbed } = require('../functions/sendErrorEmbed.js');

module.exports = {
	name: 'member',
	aliases: [ 'mbr' ],
	description: 'Manage members.',
	args: true,
	sheets: true,
	usage: '<add/remove/info> <member name/id>',
	guildOnly: true,
	commandChannel: true,
	async execute(message, args, server) {
		if (args.length <= 1 || args == undefined)
			return message.channel.send(`Invalid Arguments! Usage: \`${server.prefix}${this.name} ${this.usage}\``);
		var subcommand = args.shift().toLowerCase();
		var inputMember = args.join('_');
		if (inputMember.length > 256)
			return message.channel.send('Name is too long! The name field maxes out at `256` characters.');
		try {
			var member = await getDiscordMember(inputMember, message);
		} catch (err) {
			return message.channel.send('Unknown user! Make sure you typed in a user id.');
		}
		const spreadsheet = await loadSpreadsheet(server.sheetId);
		var rosterSheet = spreadsheet.sheetsByTitle[server.rosterName];
		try {
			switch (subcommand) {
				case 'add':
					try {
						if (await isNameOnSheet(member.name, rosterSheet))
						return message.channel.send(`This name is already in use!`);
					} catch {
						return message.channel.send('Cannot set a numerical name the same length as a Discord id!');
					}
					await addMemberToSheet(member, rosterSheet);
					let output = `Successfully added \`${member.name}\` to the roster.`;
					if (member.id === 'None') {
						output += '\n\`Don\'t forget to add their Discord and Steam I.D.!\`';
					} else {
						output += '\n\`Don\'t forget to add their Steam I.D.!\`'; 
					}
					return message.channel.send(output);
				case 'remove':
					return message.channel.send(await removeMemberFromSheet(member, rosterSheet, server));
				case 'info':
					return message.channel.send(await getMemberInfo(member, rosterSheet, server));
				default:
					return message.channel.send(
						`Invalid arguments! \nUsage: \`${server.prefix}${this.name} ${this.usage}\``
					);
			}
		} catch (err) {
			console.log(err);
			await sendErrorEmbed(message, { message: `**Command:** ${message.content}\n**Error:** ${err}` });
			return message.channel.send(`Failed to run \`${subcommand}\` on \`${member.name}\`.`);
		}
	}
};
