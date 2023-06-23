export const generateEmbedsFromFields = (embedData = {}, fields = []) => {
	let embeds = [];

	while (fields.length > 0) {
		let embedFields = fields.splice(0, 25);

		const embed = new EmbedBuilder(embedData).addFields(embedFields);

		const isFirstEmbed = embeds.length === 0,
			isLastEmbed = fields.length === 0,
			emptyImageURL = "https://i.ibb.co/Hqy36LH/Empty.png";

		if (!isFirstEmbed) embed.setThumbnail(emptyImageURL).setTitle(null).setDescription(null);
		if (!isLastEmbed) embed.setFooter(null);

		embeds.push(embed.data);
	}

	return embeds;
};
