module.exports = {
	name: 'ping',
	aliases: [ 'pong' ],
	description: 'Pong.',
	args: false,
	guildOnly: false,
	execute(message, args, server) {
		return message.channel.send('pong!');
	}
};
