const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const Schema = require("../../Structures/Schemas/FilterDB");
const sourcebin = require("sourcebin");

module.exports = {
    name: "filter",
    description: "Chat Filter",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: "help",
            description: "Help",
            type: "SUB_COMMAND",
         },
        {
           name: "clear",
           description: "Clear your blacklist",
           type: "SUB_COMMAND",
        },
        {
            name: "list",
            description: "List your blacklist",
            type: "SUB_COMMAND",
         },
        {
            name: "settings",
            description: "Setup the Filter System",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "logging",
                    description: "Select the logging channel",
                    type: "CHANNEL",
                    channelTypes: ["GUILD_TEXT"],
                    required: true,
                },
            ],
        },
        {
            name: "configure",
            description: "Add or remove words from the blacklist",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "options",
                    description: "Select an option",
                    type: "STRING",
                    required: true,
                    choices: [
                        {name: "Add", value: "add"},
                        {name: "Remove", value: "remove"},
                    ],
                },
                { name: "word",
                  description: "Provide the word, or you can add 2 or more words if you add a `,` (word,word)",
                  type: "STRING",
                  required: true,
                },
            ],
        },
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        await interaction.deferReply();

        const { guild, options } = interaction;

        const subCommand = options.getSubcommand();
        
        switch(subCommand) {
            case "help":
                const Ajuda = new MessageEmbed()
                .setColor("GREEN")
                .setTitle("**How to use /filter**")
.setDescription("/filter configure (Add/remove) (word) if you want to add more than one word (word,word,.....)\n/filter setting (log channel)\n/filter list (sends a source bin of all the blacklist words on this server\n/filter clear (deletes all the blacklist words from this server");
interaction.editReply({ embeds: [Ajuda] });
                break;
            case "list":
               const Data = await Schema.findOne({ Guild: guild.id });
               if(!Data) return;
               await sourcebin.create(
                   [
                   {
                       content: `${Data.Words.map((w) => w).join("\n") || "none"}`,
                       language: "text",
                   },
               ],
               {
                   title: `${guild.name} | Blacklist`,
                   description: "Blacklist Words",
               }
               ).then((bin) => {
                   const SourceBinéfixe = new MessageEmbed()
                   .setColor("AQUA")
                   .setDescription(`${bin.url}`);
                   interaction.editReply({ embeds: [SourceBinéfixe] });
               });
                break;
            case "clear":
                await Schema.findOneAndUpdate({Guild: guild.id}, {Words: [] });
                client.filters.set(guild.id, [] );

                const Cleared = new MessageEmbed()
                .setColor("GREEN")
                .setDescription("Cleared the blacklist");
                interaction.editReply({ embeds: [Cleared] });
                break;
            case "settings":
                const loggingChannel = options.getChannel("logging").id;

                await Schema.findOneAndUpdate({Guild: guild.id}, {Log: loggingChannel}, {new: true, upsert: true}
                    );

                    client.filtersLog.set(guild.id, loggingChannel);

                    const Embed = new MessageEmbed()
                    .setTitle("Log Channel seted")
                    .setColor("GREEN")
                    .setDescription(`Added <#${loggingChannel}> as the loggin channel for the filtering system`)

                    interaction.editReply({ embeds: [Embed], ephemeral: true });
                break;
            case "configure":
                 const Choice = options.getString("options");
                 const Words = options.getString("word").toLowerCase().split(",");

                 switch(Choice) {
                     case "add":
                         Schema.findOne({Guild: guild.id}, async (err, data) => {
                             if(err) throw err;
                             if(!data) {
                                 await Schema.create({Guild: guild.id, Log: null, Words: Words,
                                });

                                client.filters.set(guild.id, Words);
                                const Embed = new MessageEmbed()
                                .setColor("GREEN")
                                .setDescription(`Added ${Words.length} word(s) to the blacklist words`);

                                return interaction.editReply({ embeds: [Embed] });
                             }

                             const newWords = [];

                             Words.forEach((w) => {
                                 const Existe = new MessageEmbed()
                                 .setColor("RED")
                                 .setDescription(`This word already exist`)
                                 if(data.Words.includes(w)) return interaction.editReply({ embeds : [Existe] });
                                 newWords.push(w);
                                 data.Words.push(w);
                                 client.filters.get(guild.id).push(w);
                             });

                             const palavras = new MessageEmbed()
                             .setColor("GREEN")
                             .setDescription(`Added ${newWords.length} new word(s) to the blacklist words`)
                             interaction.editReply({ embeds: [palavras] 
                            });
                             data.save();
                         });
                        break;
                         case "remove":
                             Schema.findOne({Guild: guild.id}, async(err, data) => {
                                 if(err) throw err;
                                 if(!data) return;
                             
                                const removedWords = [];

                                Words.forEach((w) =>{
                                    if(!data.Words.includes(w)) return;
                                    data.Words.remove(w);
                                    removedWords.push(w);
                                });

                                const newArray = client.filters.get(guild.id).filter((word) => !removedWords.includes(word));

                                client.filters.set(guild.id, newArray);

                                const Removida = new MessageEmbed()
                                .setColor("GREEN")
                                .setDescription(`Removed ${removedWords.length} word(s) from the words blacklist`)

                                interaction.editReply({ embeds: [Removida] });
                                data.save();
                            });   
                        break;
                 }
                break;
        }
    },
};