const { MessageEmbed, Webhook, GuildMember, WebhookClient } = require("discord.js");

module.exports = {
    name: "guildMemberAdd",
    /**
     * 
     * @param {GuildMember} member 
     */
    execute(member) {

        const { user, guild } = member;

        member.roles.add("945386742553395280");

        const Welcomer = new WebhookClient({
            id: "945387128102191145",
            token: "Zvr8XYjOy1y5bVo4Zz6ZW0u4is8iBKk9e8DgFgPLcUGuksWgqdZ-vhMd6-1tYJ4849xx"
        });

        const Welcome = new MessageEmbed()
        .setColor('AQUA')
        .setThumbnail(user.avatarURL)
        .setDescription(`Bem-vindo ${member} ao servidor **${guild.name}**\n
        Conta criada à: <t:${parseInt(user.createdTimestamp / 1000)}:R>\nMembro nº **${guild.memberCount}**`)

        Welcomer.send({ embeds: [Welcome] })
    }
}