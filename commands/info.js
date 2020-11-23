const Discord = require('discord.js');
const { description, version } = require('../package.json');

module.exports = {
	name: 'info',
	aliases: [ 'info' ],
	description: 'Gives info about DELTA.',
	args: false,
	guildOnly: false,
	async execute(message, args, server) {
		const embed = new Discord.MessageEmbed()
			.setColor(15105570)
			.setThumbnail('https://i.ibb.co/2MHY6wn/D-E-L-T-A-4.jpg')
			.setTitle(`${description} v${version}:`)
			.setDescription(
				'**Bot:** Made by Vio\n**Art:** Made by Ragnarok\n**Testing:** Conducted on RU (Lead by NeonJohn)'
			)
			.setFooter('Resistance Logistics', 'https://i.ibb.co/Wzd001F/677a08d8682923ca8cb51fe48df38208.png');
		return message.channel.send(embed);
	}
};
