const { SlashCommandBuilder, EmbedBuilder, SlashCommandStringOption } = require("discord.js");
const { generateEmbedsFromFields } = require("../../functions/util/generateEmbedsFromFields");

module.exports = {
	global: true,
	guilds: null,
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("Get help with DELTA commands")
		.addStringOption(
			new SlashCommandStringOption()
				.setName("command")
				.setDescription("Which command you want help for")
				.setRequired(false)
				.setAutocomplete(true)
		)
		.setDMPermission(true),
	async execute(interaction, client) {
		const message = await interaction.deferReply({
			fetchReply: true,
		});

		const embedTheme = require("../../information/embedThemes/default.json");
		const embedTemplate = new EmbedBuilder(embedTheme)
			.setTitle("Here's a list of all my commands:")
			.setDescription("You can send `/help [command name]` to get more info on a specific command!");

		let reply = isForOneCommand(interaction)
			? handleEmbedForOneCommand(interaction, client, embedTemplate)
			: generateHelpEmbedForAllCommands(interaction, client, embedTemplate);

		await interaction.editReply(reply);
	},
	autocomplete(interaction, client) {
		const focusedValue = interaction.options.getFocused(),
			partialAutocompleteFilter = (choice) => choice.startsWith(focusedValue);

		const availableCommands = getAvailableHelpCommands(client, interaction.guildId).map(
				(command) => command.data.name
			),
			choices = availableCommands.filter(partialAutocompleteFilter);

		interaction.respond(
			choices.map((command) => ({
				name: command,
				value: command,
			}))
		);
	},
};

const isForOneCommand = (interaction) => {
	return !!interaction.options.getString("command");
};

const handleEmbedForOneCommand = (interaction, client, embedTemplate) => {
	const targetCommand = interaction.options.getString("command"),
		command = client.commands.get(targetCommand.toLowerCase());

	if (canHelpBeRanOnThisCommand(interaction, command)) {
		return generateHelpEmbedForOneCommand(embedTemplate.data, command);
	}

	return {
		content: `Command "${targetCommand}" does not exist!`,
	};
};

const generateHelpEmbedForAllCommands = (interaction, client, embedTemplate) => {
	const commands = getAvailableHelpCommands(client, interaction.guildId),
		fields = commands.map((command) => ({
			name: command.data.name,
			value: command.data.description,
			inline: false,
		}));

	const embeds = generateEmbedsFromFields(embedTemplate.data, fields);
	return {
		embeds,
	};
};

const generateHelpEmbedForOneCommand = (embedData = {}, command) => {
	const { name, description } = command.data;

	embedData.title = name;
	embedData.description = description;
	embedData.thumbnail.url = null;

	return {
		embeds: [new EmbedBuilder(embedData)],
	};
};

const canHelpBeRanOnThisCommand = (interaction, command) => {
	return !!command && shouldGuildBeAbleToSeeCommand(interaction, command);
};

const shouldGuildBeAbleToSeeCommand = (interaction, command) => {
	return command?.global || isCommandRegisteredInGuild(interaction, command);
};

const isCommandRegisteredInGuild = (interaction, command) => {
	return (command?.guilds || []).find((guild) => guild === interaction.guildId);
};

const getAvailableHelpCommands = (client, guildId) => {
	const availableCommandFilter = (command) => {
			command = command[1];
			if (command.global) return true;
			if (!command.guilds) return false;

			const isCommandRegisteredInGuild = command.guilds.find((guild) => guild === guildId);
			return isCommandRegisteredInGuild;
		},
		availableCommands = [...client.commands].filter(availableCommandFilter).map((command) => command[1]);

	return availableCommands;
};
