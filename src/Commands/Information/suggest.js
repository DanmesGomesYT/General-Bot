const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const DB = require("../../Structures/Schemas/SuggestDB");

module.exports = {
    name: "suggest",
    description: "Suggest",
    options: [
        {
            name: "type",
            description: "Select an option",
            type: "STRING",
            required: true,
            choices: [
                {name: "Text-Channel", value: "Text-Channel"},
                {name: "Voice-Channel", value: "Voice-Channel"},
                {name: "Event", value: "Event"},
                {name: "Other", value: "Other"}
            ]
        },
        {
            name: "suggestion",
            description: "Describe your suggestion.",
            type: "STRING",
            required: true
        }
    ],
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
         const { options, guildId, member, user, message } = interaction;

         const Type = options.getString("type");
         const Suggestion = options.getString("suggestion")

         const Embed = new MessageEmbed()
         .setColor('AQUA')
         .setAuthor({ name: `${user.tag}`, iconURL: `${user.displayAvatarURL({ dynamic: true, size: 512 })}` })
         .addFields(
             {name: "Suggestion:", value: Suggestion, inline: false},
             {name: "Type:", value: Type, inline: true},
             {name: "Status:", value: "Pending", inline: true}
         )
         .setTimestamp()

         const Buttons = new MessageActionRow();
         Buttons.addComponents(
             new MessageButton().setCustomId("sugges-accept").setLabel("✅Accept").setStyle("SUCCESS"),
             new MessageButton().setCustomId("sugges-decline").setLabel("⛔Decline").setStyle("DANGER")
         )

         try {
            const canal = member.guild.channels.cache.find(ch => ch.id === "947229423457955870");

            const M = await canal.send({ embeds: [Embed], components: [Buttons], fetchReply: true });

            const Sucesso = new MessageEmbed()
            .setTitle("Sucess")
            .setDescription(`Your suggestion has sent to ${canal}`)
            .setColor("GREEN")

            await interaction.reply({ embeds: [Sucesso], ephemeral: true });

            await DB.create({GuildID: guildId, MessageID: M.id, Details: [
                {
                    MemberID: member.id,
                    Type: Type,
                    Suggestion: Suggestion
                }
            ]})

         } catch (err) {
             console.log(err);
         }
    }
}