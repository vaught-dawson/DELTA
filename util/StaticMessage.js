const path = require('path');
const fs = require('fs');
const { getColumnInfo } = require('../functions/getColumnInfo.js');
const { splitEmbedsByFields } = require('../functions/splitEmbedsByFields.js');
const { loadSpreadsheet } = require('../functions/loadSpreadsheet.js');
var servers = require('../information/guilds.json');

class StaticMessage {
    constructor(data = { messageEmbeds: [''], column: '', channelID: '', guildName: '' }) {
        this.messageEmbeds = data['messageEmbeds'];
        this.column = data['column'];
        this.channelID = data['channelID'];
        this.guildName = data['guildName']
    }

    async addToFile() {
        let server = await this.getServerFromFile();
        server.staticMessages.push(this);
        saveServerObjectToFile(server);
    }

    async removeFromFile() {
        let server = await this.getServerFromFile();
        server.staticMessages = server.staticMessages.filter(messageObject => {
            return messageObject != this;
        })
        saveServerObjectToFile(server);
    }

    async savePropertiesToFile() {
        let server = await this.getServerFromFile();
        let serverIndex = await this.getObjectIndexFromFile();
        server.staticMessages[serverIndex] = this;
        await saveServerObjectToFile(server);
    }

    async getServerFromFile() {
        return servers.guilds.find(guild => {
            return guild.guildName == this.guildName
        })
    }

    async getObjectIndexFromFile() {
        let server = await this.getServerFromFile();
        let thisObjectIndex = server.staticMessages.findIndex(messageObject => {
            return messageObject.column === this.column && messageObject.channelID === this.channelID ; 
        })
        return thisObjectIndex;
    }

    async update(client) {
        const embeds = await this.generateEmbeds();
        if (this.messageEmbeds === null || this.messageEmbeds === []) {
            return await this.postMessageEmbeds(embeds, client);
        }
        if (this.messageEmbeds.length != embeds.length || !(await this.validateIntegrityOfEmbeds(client))) {
            await this.deleteMessages(client).then(() => {
                this.postMessageEmbeds(embeds, client);
            });
        } else {
            this.editEmbedMessages(embeds, client);
        }
    }

    async generateEmbeds() {
        let server = await this.getServerFromFile();
        const spreadsheet = await loadSpreadsheet(await server.spreadsheetId, await server);
        if (!spreadsheet)
            throw new Error('Invalid spreadsheet id! Make sure you set it up properly in the config.');
        const rosterSheet = spreadsheet.sheetsByTitle[server.rosterName];
        if (!rosterSheet)
            throw new Error('Invalid roster sheet name! Make sure you set it up properly in the config.');

        let embeds = await createDataEmbeds(rosterSheet, this.column, server, spreadsheet);

        return embeds;
    }

    async editEmbedMessages(newEmbeds, client) {
        let staticEmbedMessages = await this.loadStaticEmbedMessages(client);
        
        const editMessage = function (staticMessage, newEmbed) {
            return new Promise(resolve => {
                staticMessage.edit(newEmbed).then(() => {
                    resolve();
                })
            })
        }

        var messagePromises = [];
        for (let i in staticEmbedMessages) {
            messagePromises.push(editMessage(staticEmbedMessages[i], newEmbeds[i]));
        }

        Promise.all(messagePromises)
        .then(() => {
            return true;
        })
    }
    
    async deleteMessages(client) {
        let staticEmbedMessages = await this.loadStaticEmbedMessages(client);

        const deleteMessage = function (embedMessage) {
            return new Promise(resolve => {
                if (!embedMessage) resolve();
                embedMessage.delete().then(() => {
                    resolve();
                })
            })
        }

        var messagePromises = [];
        for (let embedMessage of staticEmbedMessages) {
            messagePromises.push(deleteMessage(embedMessage));
        }

        return new Promise(resolve => {
            Promise.all(messagePromises)
            .then(() => {
                this.messageEmbeds = [];
                this.savePropertiesToFile();
                resolve(true);
            })
        })

    }

    async postMessageEmbeds(embeds, client) {
        let channel = await this.getChannel(client);

        const postSingleEmbed = function(embed) {
            return new Promise(resolve => {
                channel.send(embed).then(message => {
                    resolve(message.id);
                })
            })
        }

        var messagePromises = [];
        for (let i in embeds) {
            messagePromises.push(postSingleEmbed(embeds[i]));
        }
        Promise.all(messagePromises)
            .then(data => {
                this.messageEmbeds = data;
                this.savePropertiesToFile();
            })
    }

    async getChannel(client) {
        let channel = await client.channels.cache.get(this.channelID);
        return await channel;
    }

    async loadStaticEmbedMessages(client) {
        let staticMessages = [];
        let messageEmbeds = this.messageEmbeds;
        const channel = await this.getChannel(client);
        for (let staticEmbed of messageEmbeds) {
            let message = await channel.messages.fetch({ around: staticEmbed, limit: 1 });
            message = await message.get(staticEmbed);

            staticMessages.push(await message);
        }
        return staticMessages;
    }

    async validateIntegrityOfEmbeds(client) {
        const channel = await this.getChannel(client);
        for (let staticEmbed of this.messageEmbeds) {
            let message = await (await channel).messages.fetch({ around: staticEmbed, limit: 1 });
            message = await message.get(staticEmbed);
            if (!(await message)) return false;
        }
        return true;
    }
}

async function saveServerObjectToFile(server) {
    let serverIndex = servers.guilds.indexOf(serverObj => {
        return serverObj.guildName === server.guildName;
    })

    servers.guilds[serverIndex] = await server;

    let filePath = path.resolve('./information/guilds.json');
    fs.writeFile(filePath, JSON.stringify(servers, null, 2), function writeJSON(err) {
        if (err) {
            console.log(err);
        }
    });
}

async function createDataEmbeds(rosterSheet, sheetColumn, server, spreadsheet) {
    let fields = await getColumnInfo(rosterSheet, sheetColumn, server);
    let embeds = splitEmbedsByFields(fields, 24, spreadsheet.title)
    return embeds;
}

module.exports.StaticMessage = StaticMessage;