const { MessageEmbed, Webhook, GuildMember, WebhookClient } = require("discord.js");

module.exports = {
    name: "guildMemberRemove",
    /**
     * 
     * @param {GuildMember} member 
     */
    execute(member) {

        const { user, guild } = member;

        const Tchau = new WebhookClient({
            id: "945393118121951242",
            token: "jaj1JG82_DYiOoHKk6d-Uu4bwc0JYZPsgfquWcNmlDvIJkqoAR_5ys-R5Z5VvVS1maCy"
        });

        const Welcome = new MessageEmbed()
        .setColor('AQUA')
        .setThumbnail(user.avatarURL)
        .setDescription(`${member} saiu do servidor **${guild.name}**\n
        entrou a: <t:${parseInt(member.joinedTimestamp / 1000)}:R>\nMembro nº **${guild.memberCount}**`)

        Tchau.send({ embeds: [Welcome] })
    }
}