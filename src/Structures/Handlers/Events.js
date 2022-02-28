const { Events } = require("../Validation/EventNames");

module.exports = async (client, PG, Ascii) => {
    const Table = new Ascii("Eventos");

    (await PG(`${process.cwd()}/src/Events/*/*.js`)).map(async (file) => {
        const event = require(file);
         
        if(!Events.includes(event.name) || !event.name) {
            const L = file.split("/");
            await Table.addRow(`${event.name || "Missing"}`, `⛔ O nome do evento é inválido ou não existe: ${L[6] + `/` + L[7]}`);
            return;
        }
  
        if(event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        };

        await Table.addRow(event.name, "✅")
    });

    console.log(Table.toString());
}