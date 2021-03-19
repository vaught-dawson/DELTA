const { changeGuildConfig } = require('../functions/changeGuildConfig.js');
const { sendErrorEmbed } = require('../functions/sendErrorEmbed.js');

module.exports = {
	name: 'setcommandchannel',
	aliases: [ 'setcommand' ],
	description: "Changes the server's command channel",
	args: false,
	guildOnly: true,
	commandChannel: false,
	async execute(message, args, server) {
		if (!message.member.hasPermission('ADMINISTRATOR')) {
			return message.channel.send(
				"You don't have the perms to change this! If this needs to be changed then message a server admin."
			);
		}

		try {
			await changeGuildConfig(server, 'commandChannelId', message.channel.id);
		} catch (err) {
			await sendErrorEmbed(message, { message: `**Command:** ${message.content}\n**Error:** ${err}` });
			return message.channel.send(`Failed to change the command channel to \`${args[0]}\`.`);
		}

		return message.channel.send(`Successfully made this the command channel!`);
	}
};
