const { loadDocument } = require('./loadDocument.js');

async function set(userName, userId, subcommand, data, sheetId) {
	const doc = await loadDocument(sheetId);
	var sheet = doc.sheetsByTitle['Roster'];
	var rows = await sheet.getRows();
	var output = null;
	rows.forEach((row) => {
		if (row.Name.toLowerCase() == userName.toLowerCase() || row.Discord == userId) {
			if (subcommand == 'name') {
				let oldName = row.Name;
				row.Name = data;
				try {
					row.save();
				} catch (err) {
					output = `Failed to change the name of \`${oldName}\` to \`${data}\`.`;
				}
				output = `Successfully changed the name of \`${oldName}\` to \`${data}\`.`;
			} else if (subcommand == 'rank') {
				row.Rank = data;
				try {
					row.save();
				} catch (err) {
					output = `Failed to change the rank of \`${row.Name}\` to \`${data}\`.`;
				}
				if (output == null) output = `Successfully changed the rank of \`${row.Name}\` to \`${data}\`.`;
			} else if (subcommand == 'subdiv') {
				row.SubDiv = data;
				try {
					row.save();
				} catch (err) {
					output = `Failed to change the subdivision date of \`${row.Name}\` to \`${data}\`.`;
				}
				if (output == null)
					output = `Successfully changed the subdivision date of \`${row.Name}\` to \`${data}\`.`;
			} else if (subcommand == 'promo') {
				row.LastPromo = data;
				try {
					row.save();
				} catch (err) {
					output = `Failed to change the last promotion date of \`${row.Name}\` to \`${data}\`.`;
				}
				if (output == null)
					output = `Successfully changed the last promotion date of \`${row.Name}\` to \`${data}\`.`;
			} else if (subcommand == 'status') {
				row.Status = data;
				try {
					row.save();
				} catch (err) {
					output = `Failed to change the status of \`${row.Name}\` to \`${data}\`.`;
				}
				if (output == null) output = `Successfully changed the status of \`${row.Name}\` to \`${data}\`.`;
			} else if (subcommand == 'steam') {
				row.Steam = data;
				try {
					row.save();
				} catch (err) {
					output = `Failed to change the steam id of \`${row.Name}\` to \`${data}\`.`;
				}
				if (output == null) output = `Successfully changed the steam id of \`${row.Name}\` to \`${data}\`.`;
			} else if (subcommand == 'discord') {
				row.Discord = data;
				try {
					row.save();
				} catch (err) {
					output = `Failed to change the discord id of \`${row.Name}\` to \`${data}\`.`;
				}
				if (output == null) output = `Successfully changed the discord id of \`${row.Name}\` to \`${data}\`.`;
			} else if (subcommand == 'currency') {
				row.Currency = data;
				try {
					row.save();
				} catch (err) {
					output = `Failed to change the currency of \`${row.Name}\` to \`${data}\`.`;
				}
				if (output == null) output = `Successfully changed the currency of \`${row.Name}\` to \`${data}\`.`;
			} else
				output = 'Invalid arguments. Usage: `+set <name/rank/subdiv/promo/status/steam/discord/currency> <member name> <data>`';
		}
	});
	if (output == null) return `Failed to find user \`${userName}\` in sheet \`Roster\`.`;
	return output;
}

module.exports.set = set;
