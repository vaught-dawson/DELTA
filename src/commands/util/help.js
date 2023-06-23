const fs = require("node:fs");
const { SlashCommandBuilder, EmbedBuilder, SlashCommandStringOption } = require("discord.js");
const { generateEmbedsFromFields } = require("../../functions/util/generateEmbedsFromFields");

let commandChoices = [];
const commandFolders = fs.readdirSync("./src/commands");
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter((file) => file.endsWith(".js"));

	for (const file of commandFiles) {
		const command = require(`../../commands/${folder}/${file}`);
		const commandName = command?.data?.name || "help";
		commandChoices.push({ name: commandName, value: commandName });
	}
}

const data = new SlashCommandBuilder()
	.setName("help")
	.setDescription("Get help with DELTA commands")
	.addStringOption(
		new SlashCommandStringOption()
			.setName("command")
			.setDescription("Which command you want help for")
			.setRequired(false)
	);
for (const choice of commandChoices) {
	data.options[0].addChoices(choice);
}

module.exports = {
	data,
	async execute(interaction, client) {
		const message = await interaction.deferReply({
			fetchReply: true,
			ephemeral: true,
		});

		const embedTemplate = new EmbedBuilder()
			.setColor(10921638)
			.setTitle("Here's a list of all my commands:")
			.setThumbnail("https://i.ibb.co/jrkXVxp/deltasmallogo-fotor-20230622211617.png")
			.setDescription("You can send `/help [command name]` to get more info on a specific command!")
			.setFooter({
				text: "DELTA",
				iconURL: "https://i.ibb.co/0GNv9Jq/Delta-PNG-transparent.png",
			});

		const targetCommand = interaction.options.getString("command");

		let reply;
		if (targetCommand) {
			const command = client.commands.get(targetCommand.toLowerCase());
			if (!command) {
				reply = `Command "${targetCommand}" does not exist!`;
				await interaction.editReply({
					content: reply,
					ephemeral: true,
				});
				return;
			} else {
				reply = generateHelpEmbedForOneCommand(embedTemplate.data, command);
			}
		} else {
			reply = generateHelpEmbedForAllCommands(embedTemplate.data, client);
		}

		await interaction.editReply({
			embeds: reply,
			ephemeral: true,
		});
	},
};

const generateHelpEmbedForAllCommands = (embedData = {}, client) => {
	let fields = [];
	for (let command of client.commandArray) {
		const { name, description } = command;
		fields.push({
			name,
			value: description,
			inline: false,
		});
	}

	const embeds = generateEmbedsFromFields(embedData, fields);
	return embeds;
};

const generateHelpEmbedForOneCommand = (embedData = {}, command) => {
	const { name, description, default_permission, default_member_permissions } = command.data;

	embedData.title = name;
	embedData.description = description;
	embedData.thumbnail.url = null;

	return [new EmbedBuilder(embedData)];
};
