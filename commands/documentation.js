module.exports = {
	name: 'documentation',
	aliases: [ 'doc' ],
	description: "Gives DELTA's Documentation site.",
	args: false,
	guildOnly: false,
	commandChannel: true,
	async execute(message, args, server) {
		return message.channel.send('https://sites.google.com/view/deltadocumentation');
	}
};
