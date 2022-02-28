const { MessageEmbed, Message, WebhookClient } = require("discord.js");

module.exports = {
    name: "messageDelete",
/**
 * @param {Message} message 
 */

    execute(message) {
      if(message.author.bot) return;

      const log = new MessageEmbed()
      .setColor('AQUA')
      .setDescription(`✅ A [message](${message.url}) by ${message.author.tag} was **deleted**.\n
      **Deleted Message:**\n ${message.content ? message.content : "None"}`.slice(0, 4096))

      if(message.attachments.size >= 1){
          log.addField(`Attachmentes:`, `${message.attachments.map(a => a.url)}`, true)
      }

      new WebhookClient({ url: "https://discord.com/api/webhooks/946162812714106950/eHDDbt0xN2zC_yqxq44zP0QkePWwyULj9k7SpXRKxQowUux2nvzNJtbkfX2PJlJ3kKD_" }
      ).send({ embeds: [log] }).catch((err) => { console.log(err) });

    }
}