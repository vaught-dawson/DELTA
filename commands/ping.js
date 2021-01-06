module.exports = {
	name: 'ping',
	aliases: [ 'pong' ],
	description: 'Pong!',
	args: false,
	guildOnly: false,
	commandChannel: true,
	execute(message, args, server) {
		return message.channel.send('Pong!');
	}
};
