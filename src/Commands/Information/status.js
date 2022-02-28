const { Client, MessageEmbed, CommandInteraction } = require("discord.js");
const { stat } = require("fs");
const { connection } = require("mongoose");
const { execute } = require("../../Events/Client/ready");
require("../../Events/Client/ready");

module.exports = {
    name: "status",
    description: "Os status da conexão com o Client e a database",
    permission: "ADMINISTRATOR",
   /**
    * 
    * @param {CommandInteraction} interaction 
    * @param {Client} client 
    */
   
   
    async execute(interaction, client) {

       const Response = new MessageEmbed()
       .setColor('AQUA')
       .setDescription(`**Client:** \`✅ONLINE\` - \`${client.ws.ping}ms ping\`\n **Uptime**: <t:${parseInt(client.readyTimestamp / 1000)}:R>\n
       **Database**: \`${switchTo(connection.readyState)}\``)

       interaction.reply({ embeds: [Response] })
    }
}

function switchTo(val) {
    var status = " "; 
    switch(val) {
        case 0 : status = `⛔ DISCONNECTED`
        break;
        case 1 : status = `✅ CONNECTED`
        break;
        case 2 : status = `🟠 CONNECTING`
        break;
        case 3 : status = `🔵 DISCONNECTING`
        break;
    }
    return status;
}