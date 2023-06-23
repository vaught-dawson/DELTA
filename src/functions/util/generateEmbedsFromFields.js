const { EmbedBuilder } = require("discord.js");

const generateEmbedsFromFields = (embedData = {}, fields = []) => {
	let embeds = [];

	while (fields.length > 0) {
		let embedFields = fields.splice(0, 25);

		const embed = new EmbedBuilder(embedData).addFields(embedFields);

		const isFirstEmbed = embeds.length === 0,
			isLastEmbed = fields.length === 0,
			emptyImageURL = "https://i.ibb.co/Hqy36LH/Empty.png",
			emptyCharacter = "‎";

		if (!isFirstEmbed)
			embed
				.setThumbnail(emptyImageURL)
				.setTitle(null)
				.setDescription(new Array(128).fill(emptyCharacter).join(" "));
		if (!isLastEmbed) embed.setFooter(null);

		embeds.push(embed.data);
	}

	return embeds;
};

module.exports = { generateEmbedsFromFields };
