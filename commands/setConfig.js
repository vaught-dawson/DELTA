const { changeGuildConfig } = require('../functions/changeGuildConfig.js');
const { sendErrorEmbed } = require('../functions/sendErrorEmbed.js');

module.exports = {
	name: 'setconfig',
	aliases: [ 'config' ],
	description: "Changed the server's config values (Roster sheet name, id, rank system, and essential column headers).",
	args: true,
	usage: '<spreadsheetId, rostername, name, rank, subdivisionChange, lastPromotionDate, steam, discord, status, ranksystem> <data>',
    guildOnly: true,
    commandChannel: true,
	async execute(message, args, server) {
		if (!message.member.hasPermission('ADMINISTRATOR'))
			return message.channel.send(
				"You don't have the perms to change this! If this needs to be changed then message a server admin."
			);
		if (args.length != 2)
            return message.channel.send(`Invalid arguemnts! Usage: ${server.prefix}${this.name} ${this.usage}`);
        let inputChange = args.shift().toLowerCase();
        try {
            switch (inputChange) {
                case 'spreadsheetid':
                    await changeGuildConfig(server, 'sheetId', args[0]);
                    message.delete();
                    return message.channel.send(`Successfully set the spreadsheet id!`);
                case 'rostername': 
                    await changeGuildConfig(server, 'rosterName', args[0]);
                    return message.channel.send(`Successfully set the roster name to \`${args[0]}\`!`);
                case 'name':
                    await changeGuildConfig(server, 'nameHeader', args[0]);
                    return message.channel.send(`Successfully set the name header to \`${args[0]}\`!`);
                case 'rank':
                    await changeGuildConfig(server, 'rankHeader', args[0]);
                    return message.channel.send(`Successfully set the rank header to \`${args[0]}\`!`);
                case 'subdivisionchange':
                    await changeGuildConfig(server, 'subdivisionChangeHeader', args[0]);
                    return message.channel.send(`Successfully set the subdivision-change header to \`${args[0]}\`!`);
                case 'lastpromotiondate':
                    await changeGuildConfig(server, 'lastPromotionDateHeader', args[0]);
                    return message.channel.send(`Successfully set the last promotion-date header to \`${args[0]}\`!`);
                case 'discord':
                    await changeGuildConfig(server, 'discordHeader', args[0]);
                    return message.channel.send(`Successfully set the discord header to \`${args[0]}\`!`);
                case 'status':
                    await changeGuildConfig(server, 'statusHeader', args[0]);
                    return message.channel.send(`Successfully set the status header to \`${args[0]}\`!`);
                case 'ranksystem':
                    await changeGuildConfig(server, 'rankSystem', args[0].toLowerCase());
                    return message.channel.send(`Successfully set the rank system to \`${args[0].toLowerCase()}\`!`);
                default:
                    return message.channel.send(`Invalid arguemnts! Usage: ${server.prefix}${this.name} ${this.usage}`);
            }
        } catch (err) {
            await sendErrorEmbed(message, { message: `**Command:** ${message.content}\n**Error:** ${err}` });
            return message.channel.send(`Failed to make that change to the config.`);
        }
	}
};
