const { Perms } = require("../Validation/Permissions");
const { Client } = require("discord.js");


/**
 * @param {Client} client
*/
module.exports = async (client, PG, Ascii) => {
    const Table = new Ascii("Comandos");

    CommandArray = [];

    (await PG(`${process.cwd()}/src/Commands/*/*.js`)).map(async (file) => {
        const command = require(file);

        if(!command.name)
        return Table.addRow(file.split("/")[7], "⛔ Erro no comando", "Falta '.setname' em um comando")

        if (!command.type && !command.description) 
        return Table.addRow(command.name, "⛔ Erro no comando", "Falta '.setdescription' em um comando")

        if(command.permission) {
            if(Perms.includes(command.permission))
            command.defaultPermission = false;
            else
            return Table.addRow(command.name, "⛔ Erro no comando", "Falta 'erro na parte da permissão")
        }

     client.commands.set(command.name, command);
     CommandArray.push(command);

     await Table.addRow(command.name, "✅");

    });

    console.log(Table.toString());

    // Checar as permissões

    client.on("ready", async () => {
        const MainGuild = await client.guilds.cache.get("942759123966115880");

        MainGuild.commands.set(CommandArray).then(async (command) => {
            const Roles = (commandName) => {
            const cmdPerms = CommandArray.find((c) => c.name === commandName).permission;
            if(!cmdPerms) return null;

            return MainGuild.roles.cache.filter((r) => r.permissions.has(cmdPerms));
             }

            const fullPermissions = command.reduce((accumulator, r) => {
                const roles = Roles(r.name);
                if(!roles) return accumulator;

                const permissions = roles.reduce((a, r) => {
                    return [...a, {id: r.id, type: "ROLE", permission: true}]
                }, []);

                return [...accumulator, {id: r.id, permissions}]
            }, []);

            await MainGuild.commands.permissions.set({ fullPermissions });
        });
    });
}