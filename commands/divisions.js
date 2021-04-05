const Discord = require('discord.js');
const { guilds } = require('../information/guilds.json');
const { loadSpreadsheet } = require('../functions/loadSpreadsheet.js');

module.exports = {
	name: 'divisions',
	aliases: [ 'divs' ],
	description: 'Gives info about all divisions.',
	args: false,
	guildOnly: false,
	commandChannel: true,
	hide: true,
	async execute(message) {
		if (message.author.id != '203944534839656448') {
			return message.channel.send(`Unknown command!`);
		}

		const embed = new Discord.MessageEmbed(require('../information/embedThemes/resistanceLogistics.json')).setTitle(
			'Resistance Divisions'
		);

		const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

		for (let guild of guilds) {
			if (guild.guildName == 'Logistics') continue;
			await delay(3000);
			message.channel.send(`Getting ${guild.guildName} members!`);

			const spreadsheet = await loadSpreadsheet(guild.spreadsheetId).catch((err) => {
				console.log(err);
				message.channel.send(`Unable to load spreadsheet: \`${guild.guildName}\``);
			});
			if (spreadsheet === null) {
				return message.channel.send('Invalid spreadsheet id! Make sure you set it up properly in the config.');
			}

			var rosterSheet = spreadsheet.sheetsByTitle[guild.rosterName];
			if (!rosterSheet) {
				return message.channel.send(
					'Invalid roster sheet name! Make sure you set it up properly in the config.'
				);
			}

			var rows = await rosterSheet.getRows();

			var ranks = {
				Honorary: 0,
				TR: 0,
				Enlisted: 0,
				NCO: 0,
				CO: 0,
				Other: 0
			};

			for (let i = 0; i < rows.length; i++) {
				let rankGroup = await identifyRankGroup(rows[i][guild.rankHeader], guild);
				let currentNum = ranks[rankGroup];
				ranks[rankGroup] = currentNum + 1;
			}

			embed.addField(
				`*${guild.guildName}*`,
				`**COs:** ${ranks['CO']}
					**NCOs:** ${ranks['NCO']}
					**Enlisted:** ${ranks['Enlisted']}
					**TR:** ${ranks['TR']}
					**Honorary:** ${ranks['Honorary']}
					**Other:** ${ranks['Other']}`,
				true
			);
		}

		return message.channel.send(embed);
	}
};

async function identifyRankGroup(rank, server) {
	let structure = server.rankStructure;
	const { ranks } = await require(`../information/ranks/${structure}.json`);

	let currRank = ranks.find((r) => r.name == rank);

	if (!currRank) {
		return 'Other';
	} else {
		return currRank.group;
	}
}
