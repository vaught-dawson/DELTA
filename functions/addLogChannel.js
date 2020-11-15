function addLogChannel(guild) {
	guild.createChannel(guild.name, "text").then(channel => {
    let category = guild.channels.find(c => c.name == "Delta Logs" && c.type == "category");

    if (!category) throw new Error("Category channel does not exist");
    channel.setParent(category.id);
    return channel;
  }).catch(console.error);
}

module.exports.addLogChannel = addLogChannel;
