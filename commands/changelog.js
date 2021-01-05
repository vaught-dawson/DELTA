const logisticsTestingGuildId = '749775101435838554';
const vioDiscordId = '203944534839656448';
const servers = require('../information/guilds.json');
const Discord = require('discord.js');

module.exports = {
	name: 'changelog',
	aliases: [ 'change' ],
	description: 'Sends a change log to every DELTA server with an announcements channel set up.',
	args: true,
    guildOnly: true,
    commandChannel: false,
	async execute(message, args, server, client) {
		if (server.guildId != logisticsTestingGuildId) return;
		if (message.author.id != vioDiscordId) 
			return message.channel.send('Only Vio can run this!');
		const embed = new Discord.MessageEmbed()
			.setTitle('Change Log')
			.setColor(15105570)
			.setAuthor('Vio', 'https://i.ibb.co/SyjyCdh/56dd1219215d46403de009a1c2b82bcd.png')
			.setDescription(args.join(' '))
			.setFooter('Resistance Logistics', 'https://i.ibb.co/Wzd001F/677a08d8682923ca8cb51fe48df38208.png');
		await servers.guilds.forEach(async (server) => {
			if (server['announcementChannelId']) {
				if (!server['announcementChannelId'] == '') {
					let channel = await client.channels.fetch(server.announcementChannelId);
					channel.send(embed);
				}
			}
		})
		return message.channel.send('Success!').catch(console.error());
	}
};
