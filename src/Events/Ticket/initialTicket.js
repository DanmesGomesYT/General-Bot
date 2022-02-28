const {
    ButtonInteraction,
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require("discord.js");
const DB = require("../../Structures/Schemas/Ticket");
const TicketSetupData = require("../../Structures/Schemas/TicketSetup");
module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {ButtonInteraction} interaction 
     */
    async execute(interaction) {
       if(!interaction.isButton()) return;
       const { guild, member, customId } = interaction;
   
       const Data = await TicketSetupData.findOne({ GuildID: guild.id });
       if (!Data) return;

       if(!Data.Buttons.includes(customId)) return;

       const ID = Math.floor(Math.random() * 90000) + 10000;

       await guild.channels
       .create(`${customId + "-" + ID}`, { 
       type: "GUILD_TEXT",
       parent: Data.Category,
       permissionOverwrites: [
           {
               id: member.id,
               allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
           },
           { 
            id: Data.Handlers,
            allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]  
           },
           {
               id: Data.Everyone,
               deny: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
           },
       ],
     }).then(async(channel) => {
         await DB.create({
             GuildID: guild.id,
             MemberID: member.id,
             TicketID: ID,
             ChannelID: channel.id,
             Closed: false,
             Locked: false,
             type: customId,
             Claimed: false,
         });

         const Embed = new MessageEmbed()
         .setAuthor(
            { name: `${guild.name} | Ticket: ${ID}`, iconURL: `${guild.iconURL({ dynamic: true, size: 512 })}` }
            )
            .setDescription("Please wait patiently for a response form the <@&947159304484573195>.")
            .setFooter({ text: "The buttons below are Staff Only Buttons."})
            .setColor('AQUA');
    
            const Buttons = new MessageActionRow();
            Buttons.addComponents(
                new MessageButton()
                .setCustomId("close")
                .setLabel("Save and Close")
                .setStyle("PRIMARY")
                .setEmoji("📃"),
                new MessageButton()
                .setCustomId("lock")
                .setLabel("Lock")
                .setStyle("DANGER")
                .setEmoji("🔒"),
                new MessageButton()
                .setCustomId("unlock")
                .setLabel("Unlock")
                .setStyle("SUCCESS")
                .setEmoji("🔓"),
                new MessageButton()
                .setCustomId("claim")
                .setLabel("Claim")
                .setStyle("PRIMARY")
                .setEmoji("📣")
            );
    
            channel.send({
            embeds: [Embed], 
            components: [Buttons], 
            });
            await channel.send({ content: `${member} ticket created <@&947159304484573195>`})
            .then((m) => {
                setTimeout(() => {
                    m.delete().catch(() =>{});
                }, 1 * 1000);
            });
    
          const TicketCreatedMessage = new MessageEmbed()
          .setTitle(`Your ticket has been created`)
          .setDescription(`${member} your ticket has been created: ${channel}`)
          .setColor('GREEN')
          interaction.reply({
                embeds: [TicketCreatedMessage] , ephemeral: true, });
     });
    },
};
