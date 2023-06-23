const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	global: true,
	guilds: null,
	data: new SlashCommandBuilder().setName("ping").setDescription("Pong!").setDMPermission(true),
	async execute(interaction, client) {
		const message = await interaction.deferReply({
			fetchReply: true,
		});

		const reply = `API Latency: ${client.ws.ping}\nClient Ping: ${
			message.createdTimestamp - interaction.createdTimestamp
		}`;
		await interaction.editReply({
			content: reply,
		});
	},
};
