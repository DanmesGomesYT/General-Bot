const { MessageEmbed, Message, WebhookClient } = require("discord.js");

module.exports = {
    name: "messageUpdate",
    /**
     * @param {Message} oldMessage 
     * @param {Message} newMessage 
     */
    execute(oldMessage, newMessage) {
           if(oldMessage.author.bot) return;

           if(oldMessage.content === newMessage.content) return;

           const Count = 1950;

           const Original = oldMessage.content.slice(0, Count) + (oldMessage.content.length > 1950 ? " ..." : "");
           const Edited = newMessage.content.slice(0, Count) + (newMessage.content.length > 1950 ? " ..." : "");

           const log = new MessageEmbed()
           .setColor('AQUA')
           .setDescription(`✅ A [message](${newMessage.url}) by ${newMessage.author} was **edited** in ${newMessage.channel}. \n
           **Original**:\n ${Original} \n**Edited**:\n ${Edited}`)

           new WebhookClient({ url: "https://discord.com/api/webhooks/946160101352407101/UHVnv3dVyBqiiLufnJyLneFmzsR4Do7_GEX4nYBcAXSMfYuTDgMJOXVr55SFZHASVv3q"}
           ).send({ embeds: [log] }).catch((err) => console.log(err));
    }
}