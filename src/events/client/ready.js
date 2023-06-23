module.exports = {
	name: "ready",
	once: true,
	async execute(client) {
		console.log(`[READY] ${client.user.tag} is online!`);
	},
};
