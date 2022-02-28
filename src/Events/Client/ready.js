const { Client } = require("discord.js")
const mongoose = require("mongoose");
const { Database } = require("../../Structures/config.json");
module.exports = {
    name: "ready",
    once: true,
    /**
    * @param {Client} client
    */
    execute(client) {
        console.log("O bot está on")
        client.user.setActivity("Ola bro, tás fixe?", {type: "STREAMING", url: "https://www.twitch.tv/danmesgomesyt"});


       if(!Database) return;
       mongoose.connect(Database, {
           useNewUrlParser: true,
           useUnifiedTopology: true,
        }).then(() => {
           console.log("Conectado com o mongoose")
       }).catch((err) => {
            console.log(err)
        });

        require("../../Systems/LockdownSys")(client);
        require("../../Systems/ChatFilterSys")(client);
    },
};