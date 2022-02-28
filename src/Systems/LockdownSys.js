const { Client } = require("discord.js")
const DB = require("../Structures/Schemas/LockDown");
/**
 * @param {Client} client
 */
module.exports = async (client) => {
    DB.find().then(async (documentsArray) => {
        documentsArray.forEach((d) => {
            const Channel = client.guilds.cache.get(d.GuildID).channels.cache.get(d.ChannelID);
            if (!Channel) return;

            const TimeNow = Data.now();
            if(d.Time < TimeNow)
            return Channel.permissionOverwrites.edit(d.GuildID, {
                SEND_MESSAGES: null, 
            });
            const ExpireData = d.Time - Date.now();

            setTimeout(async () => {
                Channel.permissionOverwrites.edit(d.GuildID, {
                    SEND_MESSAGES: null, 
                });
                await DB.deleteOne({ChannelID: Channel.id });
            }, ExpireData);
        });
    });
};