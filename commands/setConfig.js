const { changeGuildConfig } = require('../functions/changeGuildConfig.js');
const { sendErrorEmbed } = require('../functions/sendErrorEmbed.js');

module.exports = {
	name: 'setconfig',
	aliases: [ 'config' ],
	description: "Changes the server's config values (Roster sheet name, id, rank system, and essential column headers).",
	args: true,
	usage: '<config header> <data>',
    guildOnly: true,
    commandChannel: true,
	async execute(message, args, server) {
		if (!message.member.hasPermission('ADMINISTRATOR'))
			return message.channel.send(
				"You don't have the perms to change this! If this needs to be changed then message a server admin."
            );
        let inputHeader = args.shift().toLowerCase();
        let newHeader = args.join(' ');
        let serverHeaders = Object.keys(server);
        let actualHeader = serverHeaders.find((header) => header.toLowerCase() == inputHeader);

        if (!actualHeader)
            return message.channel.send('Invalid header! `For the list of avaliable headers, take a look at the documentation.\`');
        try {
            await changeGuildConfig(server, actualHeader, newHeader);
            if (actualHeader == 'spreadsheetId')
            await message.delete();
            return message.channel.send(`Successfully set the \`${actualHeader}\` to \`${actualHeader == 'spreadsheetId' ? 'REDACTED' : newHeader}\`!`);
        } 
        catch (err) {
            await sendErrorEmbed(message, { message: `**Command:** ${message.content}\n**Error:** ${err}` });
            return message.channel.send(`Failed to make that change to the config.`);
        }
	}
};
