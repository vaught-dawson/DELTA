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

module.exports.requestMessageInput = requestMessageInput;