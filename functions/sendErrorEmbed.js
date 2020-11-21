const Discord = require('discord.js');
const { bugReportWebhook } = require('../information/config.json');

async function sendErrorEmbed(message, error) {
	const embed = new Discord.MessageEmbed()
		.setColor(15158332)
		.setAuthor(message.author.tag)
		.setThumbnail(message.author.displayAvatarURL())
		.setTitle(`${message.guild.name}:`)
		.setDescription(error.message ? error.message : 'Failed to grab error.')
		.setFooter('Resistance Logistics', 'https://i.ibb.co/Wzd001F/677a08d8682923ca8cb51fe48df38208.png');
	const bugReportWebhookClient = new Discord.WebhookClient(bugReportWebhook.id, bugReportWebhook.token);
	bugReportWebhookClient.send('', {
		username: error.bug ? 'Bug Report' : 'Error',
		avatarURL: 'https://i.ibb.co/2MHY6wn/D-E-L-T-A-4.jpg',
		embeds: [ embed ]
	});
}

module.exports.sendErrorEmbed = sendErrorEmbed;
