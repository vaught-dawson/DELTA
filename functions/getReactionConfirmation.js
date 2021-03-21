/* eslint-disable no-async-promise-executor */
async function getReactionConfirmation(text, commandMessage) {
	text += '\n\n✅ to confirm. \n❌ to cancel.';

    let isConfirmed = await new Promise(async (resolve) => {
        await commandMessage.channel.send(text).then(async (message) => {
            await message.react('✅').then(() => message.react('❌'));

            const filter = (reaction, user) => {
                return [ '✅', '❌' ].includes(reaction.emoji.name) && user.id === commandMessage.author.id;
            };

            await message
                .awaitReactions(filter, { max: 1, time: 60000, errors: [ 'time' ] })
                .then((collected) => {
                    message.delete();

                    const reaction = collected.first();
                    if (reaction.emoji.name === '✅') {
                        message.channel.send('Confirmed operation!');
                        resolve(true);
                    } else {
                        message.channel.send('Cancelled operation.');
                        resolve(false);
                    }
                })
                .catch(() => {
                    message.delete();
                    message.channel.send('Timed out! Cancelling operation.');
                    resolve(false);
                });
        });
    })

    return await isConfirmed;
}

module.exports.getReactionConfirmation = getReactionConfirmation;
