const { getMemberFromSheetById } = require('../functions/getMemberFromSheetById.js');
const { getMemberFromSheetByName } = require('../functions/getMemberFromSheetByName.js');
const { combineElementsByCharacter } = require('../functions/combineElementsByCharacter.js');
const { getDiscordMember } = require('../functions/getDiscordMember.js');
const { loadSpreadsheet } = require('../functions/loadSpreadsheet.js');
const { removeMemberFromSheet } = require('../functions/removeMemberFromSheet.js');
const { sendErrorEmbed } = require('../functions/sendErrorEmbed.js');

module.exports = {
	name: 'ck',
	aliases: [ 'kill', 'remove', 'rmv'],
	description: 'Remove multiple members from the roster.',
	args: true,
	sheets: true,
	usage: '<member name/id> ...',
	guildOnly: true,
	commandChannel: true,
	async execute(message, args, server) {
		if (args == undefined) {
            return message.channel.send(`Invalid Arguments! Usage: \`${server.prefix}${this.name} ${this.usage}\``);
        }

        args = combineElementsByCharacter(args, '"');

        var members = [];
        for (let i = 0; i < args.length; i++) {
            let inputMember = args[i];

            try {
                var member = await getDiscordMember(inputMember, message);
                members.push(member);
            } catch (err) {
                message.channel.send(`Unknown user: ${inputMember}. Moving on to next member.`);
                continue;
            }
        }

        const spreadsheet = await loadSpreadsheet(server.spreadsheetId);
    
		if (spreadsheet === null) {
            return message.channel.send('Invalid spreadsheet id! Make sure you set it up properly in the config.');
        }
        
		var rosterSheet = spreadsheet.sheetsByTitle[server.rosterName];
		if (!rosterSheet) {
            return message.channel.send('Invalid roster sheet name! Make sure you set it up properly in the config.');
        }

        var outputLog = '';
        for (let i = 0; i < members.length; i++) {
            try {
                var memberData = await getMemberFromSheetById(members[i], rosterSheet, server);

                if (!memberData) {
                    memberData = await getMemberFromSheetByName(members[i], rosterSheet, server);

                    if (!memberData) {
                        return message.channel.send(
                            `Member \`${members[i].name == null ? members[i].id : members[i].name}\` not found on the roster!`
                        );
                    }
                }
                
                outputLog += `\n\`${server.memberLogPrefix} ${memberData[server.rankHeader].split('-').pop()} ${memberData[
                    server.nameHeader
                ]} -> CK\``;

                message.channel.send(await removeMemberFromSheet(members[i], rosterSheet, server));

            } catch(err) {
                console.log(err);
                await sendErrorEmbed(message, { message: `**Command:** ${message.content}\n**Error:** ${err}` });
                message.channel.send(`Failed to run \`ck\` on \`${members[i].name}\`.`);
            }
        }

        return message.channel.send(outputLog);
	}
};
