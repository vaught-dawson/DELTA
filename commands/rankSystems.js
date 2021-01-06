const Discord = require('discord.js');
const fs = require ('fs');

module.exports = {
	name: 'ranksystems',
	aliases: [ 'ranks' ],
	description: 'Lists the available rank systems to choose from.',
	args: false,
	guildOnly: false,
	commandChannel: true,
	async execute(message, args, server) {
		const embed = new Discord.MessageEmbed()
			.setColor(15105570)
			.setTitle(`Avaliable rank systems:`)
            .setFooter('Resistance Logistics', 'https://i.ibb.co/Wzd001F/677a08d8682923ca8cb51fe48df38208.png');
        
        let path = '.\\information\\ranks'
        const rankSystems = fs.readdirSync(path).filter((file) => file.endsWith('.json'));

        let desc = [];
        rankSystems.forEach((system) => {
            desc.push(system.substring(0, system.length - 5));
        })
        embed.setDescription(desc.join(', '));

		return message.channel.send(embed);
	}
};
