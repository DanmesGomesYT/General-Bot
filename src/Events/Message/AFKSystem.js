const { Message, MessageEmbed } = require("discord.js");
const { execute } = require("../../Commands/Information/afk");
const DB = require("../../Structures/Schemas/AFKSystem");

module.exports = {
    name: "messageCreate",
/**
 * 
 * @param {Message} message 
 */
    async execute(message) {
          if(message.author.bot) return;

          // await DB.deleteOne({GuildID: message.guild.id, UserID: message.author.id});

        if(message.mentions.members.size) {
            const Embed = new MessageEmbed()
            .setColor("RED");
            message.mentions.members.forEach((m) => {
                DB.findOne({GuildID: message.guild.id, UserID: m.id}, async (err, data) => {          
                    if(err) throw err;
                    if(!data) return;
                    if(data)
                    Embed.setDescription(`${m} went AFK <t:${data.Time}:R>\n **Status:** ${data.Status}`);
                    message.reply({embeds: [Embed], ephemeral: true});  
                });
            })
        }
    }
}
