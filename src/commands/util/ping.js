const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder().setName("ping").setDescription("Pong!"),
	async execute(interaction, client) {
		const message = await interaction.deferReply({
			fetchReply: true,
			ephemeral: true,
		});

		const reply = `API Latency: ${client.ws.ping}\nClient Ping: ${
			message.createdTimestamp - interaction.createdTimestamp
		}`;
		await interaction.editReply({
			content: reply,
			ephemeral: true,
		});
	},
};
