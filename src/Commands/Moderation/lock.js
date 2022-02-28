const {
    CommandInteraction,
    MessageEmbed
} = require("discord.js");
const DB = require("../../Structures/Schemas/LockDown");
const ms = require("ms");

module.exports = {
    name: "lock",
    description: "Lockdown this channel",
    permission: "MANAGE_CHANNELS",
    options: [
        {
            name: "time",
            description: "Expire data for this lockdown (1m, 1h, 1d)",
            type: "STRING",
        },
        {
            name: "reason",
            description: "Provide a reason",
            type: "STRING",
        },
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const {
            guild,
            channel,
            options
        } = interaction;

        const Reason = options.getString("reason") || "no specified reasons"

        const Embed = new MessageEmbed();

        if (!channel.permissionsFor(guild.id).has("SEND_MESSAGES"))
            return interaction.reply({ embeds: [Embed.setColor("RED").setDescription("⛔ This channel is already locked.")], ephemeral: true});

        channel.permissionOverwrites.edit(guild.id, {
            SEND_MESSAGES: false,
        });

        const Time = options.getString("time");

        interaction.reply({
            embeds: [Embed.setColor("RED").setDescription(`🔒Channel got lock for ${Time}\n
Reason: ${Reason}`)]
        })

        if (Time) {
            const ExpireData = Date.now() + ms(Time);
            DB.create({
                GuildID: guild.id,
                ChannelID: channel.id,
                Time: ExpireData
            });

            setTimeout(async () => {
                channel.permissionOverwrites.edit(guild.id, {
                    SEND_MESSAGES: null,
                });
                interaction.editReply({
                        embeds: [Embed.setDescription("🔓 Lock down ended").setColor(
                            "GREEN"
                        ), ],
                    })
                    .catch(() => {});
                await DB.deleteOne({
                    ChannelID: channel.id
                });
            }, ms(Time));
        }
    },
};