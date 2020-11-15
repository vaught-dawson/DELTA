const Discord = require('discord.js');

module.exports = {
	name: 'bugreport',
	aliases: [ 'report', 'bug', 'reportbug' ],
	description: 'Report a bug about DELTA.',
    args: true,
    usage: '<report info>',
	guildOnly: true,
	async execute(message, args, server) {
		const embed = new Discord.MessageEmbed()
            .setColor(15158332)
            .setAuthor(message.author.tag)
            .setThumbnail(message.author.displayAvatarURL())
			.setTitle(`${server.name}:`)
			.setDescription(args.join(" "))
            .setFooter('Resistance Logistics', 'https://i.ibb.co/Wzd001F/677a08d8682923ca8cb51fe48df38208.png');
        try {
            const bugReportWebhookClient = new Discord.WebhookClient(server.bugReportWebhookId, server.bugReportWebhookToken);
                bugReportWebhookClient.send('', {
                username: 'Bug Report',
                avatarURL: 'https://i.ibb.co/2MHY6wn/D-E-L-T-A-4.jpg',
                embeds: [embed]
            });
            return message.channel.send('Successfully submitted a bug report.');
        } catch (err) {
            return message.channel.send('Failed to submit a bug report.');
        }
        
	}
};
