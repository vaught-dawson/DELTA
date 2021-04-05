async function requestMessageInput(originalCommandMessageObject, promptToAsk) {
	let filter = (m) => m.author.id === originalCommandMessageObject.author.id;
	const response = new Promise((resolve) => {
		originalCommandMessageObject.channel.send(promptToAsk).then(async () => {
			originalCommandMessageObject.channel
				.awaitMessages(filter, {
					max: 1,
					time: 60000,
					errors: [ 'time' ]
				})
				.then((message) => {
					resolve(message.first());
				})
				.catch(() => {
					throw originalCommandMessageObject.channel.send(
						'Timed out! User has not answered the prompt in time.'
					);
				});
		});
	});
	return response;
}

module.exports.requestMessageInput = requestMessageInput;