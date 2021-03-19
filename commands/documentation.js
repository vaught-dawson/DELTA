module.exports = {
	name: 'documentation',
	aliases: [ 'doc' ],
	description: "Gives DELTA's Documentation site.",
	args: false,
	guildOnly: false,
	commandChannel: true,
	async execute(message) {
		return message.channel.send('https://sites.google.com/view/deltadocumentation');
	}
};
