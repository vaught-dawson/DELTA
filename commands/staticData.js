const { StaticMessage } = require('../util/StaticMessage.js');
const { loadSpreadsheet } = require('../functions/loadSpreadsheet.js');
const { getSheetHeaders } = require('../functions/getSheetHeaders.js');
const { requestMessageInput } = require('../functions/requestMessageInput.js');
const { splitEmbedsByFields } = require('../functions/splitEmbedsByFields.js');
const { Message } = require('discord.js');

module.exports = {
	name: 'staticdata',
	aliases: [ 'static' ],
	description: "Creates embeds and updates it's data hourly from a column in the roster.",
	args: true,
	usage: '<add/remove/update> <column>',
	guildOnly: true,
	commandChannel: false,
	async execute(message = Message, args = [], server = {}) {
		if (!message.member.hasPermission('ADMINISTRATOR') && message.author.id != '203944534839656448') {
			return message.channel.send(
				"You don't have the perms to change this! If this needs to be changed then message a server admin."
			);
		}

		var subcommand = args.shift().toLowerCase();
		let inputColumn = args.join(' ').toLowerCase();
		let sheetColumn = await getSheetColumn(inputColumn, server).catch((error) => {
			return message.channel.send(error.message);
		});

		let thisStaticMessageObject = await getStaticMessageFromFile(server, await sheetColumn, message.channel.id);

		switch (subcommand) {
			case 'add':
				if (thisStaticMessageObject)
					return message.channel.send(
						'Cannot Create Static Message: `This static message object already exists!`'
					);
				thisStaticMessageObject = createNewStaticMessageObject(
					sheetColumn,
					message.channel.id,
					server.guildName
				);
				await thisStaticMessageObject.addToFile();
				await thisStaticMessageObject.update(message.client);

				await message.delete();
				await message.channel.send('Successfully updated static message!').then(message => {
					setTimeout(() => {
						message.delete();
					}, 3000)
				})
				return;
			case 'remove':
				if (!thisStaticMessageObject) {
					message.channel.send(
						"Couldn't Delete Static Message: `Static Message Column Not Defined!`"
					);
					
					let staticMessages = await getStaticMessagesFromFile(server);
					await sendStaticMessageListToCommandChannel(message, await staticMessages);
					let staticMessageIndex = await requestMessageInput(message, "Enter the index of the static message you want to delete:").catch();

					thisStaticMessageObject = await getStaticMessageFromFile(server, await staticMessages[staticMessageIndex]['column'], await staticMessages[staticMessageIndex]['channelID']);
				}

				await thisStaticMessageObject.deleteMessages(message.client).then(() => {
					thisStaticMessageObject.removeFromFile();
				})

				await message.delete();
				await message.channel.send('Successfully removed static message!').then(message => {
					setTimeout(() => {
						message.delete();
					}, 3000)
				})
				return;
			case 'update':
				if (!thisStaticMessageObject)
					return message.channel.send(
						"Cannot Update Static Message: `This static message object doesn't exist!`"
					);
				await thisStaticMessageObject.update(message.client);

				await message.delete();
				await message.channel.send('Successfully updated static message!').then(message => {
					setTimeout(() => {
						message.delete();
					}, 3000)
				})
				return;
			default:
				return message.channel.send(`Invalid Arguments! Usage: \`${server.prefix}${this.name} ${this.usage}\``);
		}
	}
};

async function getSheetColumn(inputColumn = '', server = {}) {
	const spreadsheet = await loadSpreadsheet(server.spreadsheetId, server);
	if (spreadsheet === null) {
		throw new Error('Invalid spreadsheet id! Make sure you set it up properly in the config.');
	}
	const rosterSheet = spreadsheet.sheetsByTitle[server.rosterName];
	if (!rosterSheet) {
		throw new Error('Invalid roster sheet name! Make sure you set it up properly in the config.');
	}

	const headers = await getSheetHeaders(rosterSheet);

	let sheetColumn = await headers.find((header) => {
		return header.toLowerCase() == inputColumn;
	});
	if (!sheetColumn) {
		throw new Error('Invalid column header! Make sure you typed it right.');
	}

	return await sheetColumn;
}

async function getStaticMessageFromFile(server = {}, sheetColumn = '', channelID = '') {
	let staticMessageFromFile = await server.staticMessages.find((staticMessageObj) => {
		return staticMessageObj.column == sheetColumn && staticMessageObj.channelID == channelID;
	});
	if (await staticMessageFromFile) return new StaticMessage(staticMessageFromFile);
	return null;
}

async function getStaticMessagesFromFile(server = {}) {
	return await server.staticMessages;
}

async function sendStaticMessageListToCommandChannel(originalCommandMessageObject, staticMessageList) {
	let fields = [];
	for (let staticMessage of staticMessageList) {
		fields.push({
			name: `Index: ${fields.length}`,
			value: `**Column Name:** ${staticMessage['column']}\n**Channel Id:** ${staticMessage['channelID']}`,
			inline: false
		});
	}
	let embeds = splitEmbedsByFields(fields, 24, "Static Messages");
	embeds.forEach((embed) => {
		originalCommandMessageObject.channel.send(embed);
	});
}

// async function isValidStaticMessage(staticMessageObject = StaticMessage) {
// 	if (!staticMessageObject || staticMessageObject === null || staticMessageObject.column == '') return false;
// 	return true;
// }

function createNewStaticMessageObject(column, channelID, guildName) {
	return new StaticMessage({
		messageEmbeds: null,
		column: column,
		channelID: channelID,
		guildName: guildName
	});
}
