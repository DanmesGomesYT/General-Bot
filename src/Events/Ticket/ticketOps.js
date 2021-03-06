const { ButtonInteraction, MessageEmbed } = require("discord.js");
const { createTranscript } = require("discord-html-transcripts");

const DB = require("../../Structures/Schemas/Ticket");
const TicketSetupData = require("../../Structures/Schemas/TicketSetup");

module.exports = {
    name: "interactionCreate",
/**
 * 
 * @param {ButtonInteraction} interaction 
 */
    async execute(interaction) {
        if (!interaction.isButton()) return;
        const { guild, customId, channel, member } = interaction;
        if(!["close", "lock", "unlock", "claim"]) return;

        const TicketSetup = await TicketSetupData.findOne({ GuildID: guild.id });
        if(!TicketSetup) return;

        if(!member.roles.cache.find((r) => r.id === TicketSetup.Handlers)) return; // interaction.reply({content: "You cannot use these buttons"})


        const Embed = new MessageEmbed()
        .setColor("AQUA");

        DB.findOne({ ChannelID: channel.id }, async (err, docs) => {
             if (err) throw err;
             if (!docs) return; 
           //  interaction.reply({content: "No data related to this ticket, please delete it manualy.", ephemeral: true });
         switch (customId) {
             case "lock":
                 if (docs.Locked == true) return;
            await DB.updateOne({ ChannelID: channel.id}, {Locked: true });
            Embed.setDescription("๐This Ticket Is Locked");

            docs.MembersID.forEach((m) => {
                channel.permissionOverwrites.edit(m, {
                    SEND_MESSAGES: false,
            });
            });

            interaction.reply({embeds : [Embed] });
            break;
            case "unlock":
                if (docs.Locked == false)
                return interaction.reply({
               content: "The ticket is already locked",
               ephemeral: true
           });
           await DB.updateOne({ ChannelID: channel.id}, {Locked: false });
           Embed.setDescription("๐ This Ticket Is Locked");
           
           docs.MembersID.forEach((m) => {
            channel.permissionOverwrites.edit(m, {
                SEND_MESSAGES: true,
        });
        });
           interaction.reply({ embeds : [Embed] });
           break;
           case "close":
               if (docs.Closed == true) return;
        const attachment = await createTranscript(channel, {
            limit: -1,
            returnBuffer: false,
            fileName: `${docs.Type} - ${docs.TicketID}.html`,
        });
        await DB.updateOne({ChannelID: channel.id}, {Closed: true});

        const Message = await guild.channels.cache
        .get(TicketSetup.Transcripts)
        .send({
            embeds: [
                Embed.setTitle(
                    `ID: ${docs.TicketID}`
                    ),
        ],
        files: [attachment],
    });
    interaction.reply({ 
        embeds: [
            Embed.setDescription(
                `The transcript is now saved [TRANSCRIPT](${Message.url})`
    ),
],
 });
    
 setTimeout(() => {
     channel.delete();
 }, 1 * 4000);
 break;
 case "claim":
     if (docs.Claimed == true) 
         return;
     
      await DB.updateOne({
           ChannelID: channel.id}, 
           {Claimed: true, ClaimedBy: member.id }
           );

      Embed.setDescription(`๐ฃ This ticket is now claimed by ${member}`);
      interaction.reply({ embeds: [Embed] });

     break;
         }
      });
    },
};
