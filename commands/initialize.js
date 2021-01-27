const { changeGuildConfig } = require('../functions/changeGuildConfig.js');
const { sendErrorEmbed } = require('../functions/sendErrorEmbed.js');

module.exports = {
	name: 'initialize',
	aliases: [ 'init' ],
	description: 'Walks through setting up DELTA in Discord. Sets current channel as command channel.',
	args: false,
	guildOnly: true,
	commandChannel: false,
	async execute(message, args, server) {
		if (!message.member.hasPermission('ADMINISTRATOR')) {
			return message.channel.send(
				"You don't have the perms to change this! If this needs to be changed then message a server admin."
			);
		}

		await changeGuildConfig(server, 'commandChannelId', message.channel.id).catch(async (err) => {
			await sendErrorEmbed(message, { message: `**Command:** ${message.content}\n**Error:** ${err}` });
			message.channel.send(`Failed to set the command channel.`);
		});

		message.channel.send('Successfully set this channel as the command channel.');

		let spreadsheetIdMessage = await requestMessageInput(message, 'Enter your spreadsheet id:');
		await changeGuildConfig(server, 'spreadsheetId', spreadsheetIdMessage.content)
			.then(async () => {
				await spreadsheetIdMessage.delete();
				return message.channel.send(
					'Successfully set the spreadsheet id (Your message was deleted for privacy).'
				);
			})
			.catch((err) => {
				console.log(err);
				return message.channel.send('Failed to set the spreadsheet id.');
			});

		let rosterSheetNameMessage = await requestMessageInput(message, 'Enter your roster sheet name:');
		await changeGuildConfig(server, 'rosterName', rosterSheetNameMessage.content)
			.then(async () => {
				return message.channel.send('Successfully set the roster sheet name.');
			})
			.catch((err) => {
				console.log(err);
				return message.channel.send('Failed to set the roster sheet name.');
			});

		let nameHeaderMessage = await requestMessageInput(message, "Enter your 'name' header:");
		await changeGuildConfig(server, 'nameHeader', nameHeaderMessage.content)
			.then(async () => {
				return message.channel.send("Successfully set the 'name' header");
			})
			.catch((err) => {
				console.log(err);
				return message.channel.send("Failed to set the 'name' header");
			});

		let rankHeaderMessage = await requestMessageInput(message, "Enter your 'rank' header:");
		await changeGuildConfig(server, 'rankHeader', rankHeaderMessage.content)
			.then(async () => {
				return message.channel.send("Successfully set the 'rank' header");
			})
			.catch((err) => {
				console.log(err);
				return message.channel.send("Failed to set the 'rank' header");
			});

		let lastPromotionDateHeaderMessage = await requestMessageInput(
			message,
			"Enter your 'last promotion date' header:"
		);
		await changeGuildConfig(server, 'lastPromotionDateHeader', lastPromotionDateHeaderMessage.content)
			.then(async () => {
				return message.channel.send("Successfully set the 'last promotion date' header");
			})
			.catch((err) => {
				console.log(err);
				return message.channel.send("Failed to set the 'last promotion date' header");
			});

		let statusHeaderMessage = await requestMessageInput(message, "Enter your 'status' header:");
		await changeGuildConfig(server, 'statusHeader', statusHeaderMessage.content)
			.then(async () => {
				return message.channel.send("Successfully set the 'status' header");
			})
			.catch((err) => {
				console.log(err);
				return message.channel.send("Failed to set the 'status' header");
			});

		let discordIdHeaderMessage = await requestMessageInput(message, "Enter your 'discord' header:");
		await changeGuildConfig(server, 'discordHeader', discordIdHeaderMessage.content)
			.then(async () => {
				return message.channel.send("Successfully set the 'discord' header");
			})
			.catch((err) => {
				console.log(err);
				return message.channel.send("Failed to set the 'discord' header");
			});

		return message.channel.send('Finished initialization!');
	}
};

async function requestMessageInput(originalCommandMessage, requestMessage) {
	let filter = (m) => m.author.id === originalCommandMessage.author.id;
	const response = new Promise((resolve) => {
		originalCommandMessage.channel.send(requestMessage).then(async () => {
			originalCommandMessage.channel
				.awaitMessages(filter, {
					max: 1,
					time: 60000,
					errors: [ 'time' ]
				})
				.then((message) => {
					resolve(message.first());
				})
				.catch(() => {
					return originalCommandMessage.channel.send(
						'Timed out! Please restart the initialization proccess.'
					);
				});
		});
	});
	return response;
}
