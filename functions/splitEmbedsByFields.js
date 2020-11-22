const Discord = require('discord.js');

function splitEmbedsByFields(fieldsContent, fieldCount, title) {
	var embeds = [],
		isFirstEmbed = true;
	while (fieldsContent.length > 0) {
		let fields = [];
		for (let i = 0; i < fieldCount; i++) {
			if (fieldsContent.length == 0) break;
			fields.push(fieldsContent.shift());
		}
		var embed = new Discord.MessageEmbed({
			color: 15105570,
			fields: fields
		});
		if (isFirstEmbed) {
			embed.setTitle(title);
			embed.setThumbnail('https://i.ibb.co/2MHY6wn/D-E-L-T-A-4.jpg');
			isFirstEmbed = false;
		}

		if (fieldsContent.length == 0) {
			embed.setFooter('Resistance Logistics', 'https://i.ibb.co/Wzd001F/677a08d8682923ca8cb51fe48df38208.png');
		}

		embeds.push(embed);
	}
	return embeds;
}

module.exports.splitEmbedsByFields = splitEmbedsByFields;
