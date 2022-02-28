const {
    MessageEmbed,
    CommandInteraction,
    MessageActionRow,
    MessageButton,
} = require("discord.js");
const DB = require("../../Structures/Schemas/TicketSetup");

module.exports = {
    name: "ticketsetup",
    description: "Setup your ticketing message",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: "channel",
            description: "Select the ticket creation channel",
            required: true,
            type: "CHANNEL",
            channelTypes: ["GUILD_TEXT"],
        },
        {
            name: "category",
            description: "Select the ticket channel category",
            required: true,
            type: "CHANNEL",
            channelTypes: ["GUILD_CATEGORY"],
        },
        {
            name: "transcripts",
            description: "Select the transcripts channel",
            required: true,
            type: "CHANNEL",
            channelTypes: ["GUILD_TEXT"],
        },
        {
            name: "handlers",
            description: "Select the ticket handlers's role",
            required: true,
            type: "CHANNEL",
            type: "ROLE",
        },
        {
            name: "everyone",
            description: "Provide the @everyone role",
            required: true,
            type: "ROLE",
        },
        {
            name: "description",
            description: "Set the description of the ticket embed",
            required: true,
            type: "STRING",
        },
        {
            name: "firstbuttons",
            description: "Give your first button a name and a emoji. EX: '(name), (emoji)",
            required: true,
            type: "STRING",
        },
        {
            name: "secondbuttons",
            description: "Give your second button a name and a emoji. EX: '(name), (emoji)",
            required: true,
            type: "STRING",
        },
        {
            name: "thirdbuttons",
            description: "Give your third button a name and a emoji. EX: '(name), (emoji)",
            required: true,
            type: "STRING",
        },
        {
            name: "fourthbuttons",
            description: "Give your fourth button a name and a emoji. EX: '(name), (emoji)",
            required: true,
            type: "STRING",
        },
    ],


    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const {
            guild,
            options
        } = interaction;

        try {
            const Channel = options.getChannel("channel");
            const Category = options.getChannel("category");
            const Transcripts = options.getChannel("transcripts");
            const Handlers = options.getRole("handlers");
            const Everyone = options.getRole("everyone");

            const Description = options.getString("description");

            const Button1 = options.getString("firstbuttons").split(",");
            const Button2 = options.getString("secondbuttons").split(",");
            const Button3 = options.getString("thirdbuttons").split(",");
            const Button4 = options.getString("fourthbuttons").split(",");

            const Emoji1 = Button1[1];
            const Emoji2 = Button2[1];
            const Emoji3 = Button3[1];
            const Emoji4 = Button4[1];

            await DB.findOneAndUpdate({
                GuildID: guild.id
            }, {
                Channel: Channel.id,
                Category: Category.id,
                Transcripts: Transcripts.id,
                Handlers: Handlers.id,
                Everyone: Everyone.id,
                Description: Description.id,
                Buttons: [Button1[0], Button2[0], Button3[0]],
            }, {
                new: true,
                upsert: true,
            });

            const Buttons = new MessageActionRow();
            Buttons.addComponents(
                new MessageButton()
                .setCustomId(Button1[0])
                .setLabel(Button1[0])
                .setStyle("DANGER")
                .setEmoji(Emoji1),
                new MessageButton()
                .setCustomId(Button2[0])
                .setLabel(Button2[0])
                .setStyle("DANGER")
                .setEmoji(Emoji2),
                new MessageButton()
                .setCustomId(Button3[0])
                .setLabel(Button3[0])
                .setStyle("SUCCESS")
                .setEmoji(Emoji3),
                new MessageButton()
                .setCustomId(Button4[0])
                .setLabel(Button4[0])
                .setStyle("SUCCESS")
                .setEmoji(Emoji4)
            );

            const Embed = new MessageEmbed()
                .setAuthor({
                    name: `${guild.name} | Ticket`,
                    iconURL: `${guild.iconURL({ dynamic: true, size: 512 })}`
                })
                .setDescription(Description)
                .setColor('AQUA');

            await guild.channels.cache.get(Channel.id).send({
                embeds: [Embed],
                components: [Buttons]
            });

            interaction.reply({
                content: "Done",
                ephemeral: true
            });

        } catch (err) {
            const errEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`⛔ An erro occured while setting up your ticket\n**What to make sure of?**\n
            1. Make sure none of your buttons names are duplicated
            2. Make sure you use this format for your buttons: Name,Emoji
            3. Make sure your button names do not exceed 200 words
            4. Make sure yuor button emojis, are actualy emojis, not ids`);
            console.log(err);
            interaction.reply({
                embeds: [errEmbed],
                ephemeral: true
            });
        }


    },
};