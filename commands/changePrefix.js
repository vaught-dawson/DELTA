const { changeGuildConfig } = require('../functions/changeGuildConfig.js');
const { sendErrorEmbed } = require('../functions/sendErrorEmbed.js');

module.exports = {
	name: 'changeprefix',
	aliases: [ 'prefix', 'cngpre', 'prefixchange', 'setprefix' ],
	description: "Changes the server's prefix for DELTA.",
	args: true,
	usage: '<new prefix>',
	guildOnly: true,
	async execute(message, args, server) {
		if (!message.member.hasPermission('ADMINISTRATOR'))
			return message.channel.send(
				"You don't have the perms to change this! If this needs to be changed then talk to a server admin."
			);

		if (args.length > 1)
			return message.channel.send(`Invalid arguments! \nUsage: \`${server.prefix}${this.name} ${this.usage}\``);
		if (args[0].length > 1)
			return message.channel.send(`Invalid length! A prefix can only be one character!`);
		try {
			await changeGuildConfig(server, 'prefix', args[0]);
		} catch (err) {
			await sendErrorEmbed(message, { message: `**Command:** ${message.content}\n**Error:** ${err}` });
			return message.channel.send(`Failed to change the prefix to \`${args[0]}\`.`);
		}
		return message.channel.send(`Successfully changed the prefix to \`${args[0]}\`.`);
	}
};
