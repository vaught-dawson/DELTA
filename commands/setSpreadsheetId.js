const { changeGuildConfig } = require('../functions/changeGuildConfig.js');
const { sendErrorEmbed } = require('../functions/sendErrorEmbed.js');

module.exports = {
	name: 'setspreadsheetid',
	aliases: [ 'setsheet', 'setspreadhseet', 'setsheetid' ],
	description: "Changes the server's spreadsheet id.",
	args: true,
	usage: '<spreadsheet id>',
	guildOnly: true,
	commandChannel: true,
	async execute(message, args, server) {
		if (!message.member.hasPermission('ADMINISTRATOR'))
			return message.channel.send(
				"You don't have the perms to change this! If this needs to be changed then message a server admin."
			);
		if (args.length != 1)
			return message.channel.send(`Invalid arguemnts! Usage: ${server.prefix}${this.name} ${this.usage}`);
		try {
			await changeGuildConfig(server, 'spreadsheetId', args[0]);
		} catch (err) {
			await sendErrorEmbed(message, { message: `**Command:** ${message.content}\n**Error:** ${err}` });
			return message.channel.send(`Failed to change the spreadsheet id.`);
		}
		message.delete();
		return message.channel.send('Successfully set the spreadsheet id (Your message was deleted for privacy).');
	}
};
