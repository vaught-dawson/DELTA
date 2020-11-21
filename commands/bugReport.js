const { sendErrorEmbed } = require('../functions/sendErrorEmbed.js');

module.exports = {
	name: 'bugreport',
	aliases: [ 'report', 'bug', 'reportbug' ],
	description: 'Report a bug about DELTA.',
	args: true,
	usage: '<report info>',
	guildOnly: true,
	async execute(message, args, server) {
		var error = {
			bug: true,
			message: args.join(' ')
		};
		try {
			await sendErrorEmbed(message, error);
		} catch (err) {
            console.log(err);
			return message.channel.send('Failed to send bug report.');
		}
		return message.channel.send('Successfully sent bug report!');
	}
};
