function notifyOwner(guild) {
	if (guild.owner != null) {
		guild.owner.user.send(
			`DELTA has recently been added to \`${guild.name}\`. \nMake sure you set the command channel with \`+setchannel\`. \nAs well as your roster spreadsheet id with \`+setsheet\`!`
		);
	}
}

module.exports.notifyOwner = notifyOwner;
