const { GuildMember, MessageEmbed, MessageAttachment } = require("discord.js");
const Canvas = require("canvas");

module.exports = {
    name: "guildMemberUpdate",
    /**
     * 
     * @param {GuildMember} oldMember 
     * @param {GuildMember} newMeber 
     */
    async execute(oldMember, newMeber) {
        const { guild } = newMeber;
        
        const Thankyou = new MessageEmbed()
        .setColor('LUMINOUS_VIVID_PINK')
        .setAuthor({ name: "SERVER BOOSTED", iconURL: `${guild.iconURL({ dynamic: true, size: 512 })}` })

        if(!oldMember.premiumSince && newMeber.premiumSince) {
            const canvas = Canvas.createCanvas(800, 250);
        const ctx = canvas.getContext("2d");

        const background = await Canvas.loadImage("./Structures/Images/arroz fixe.jpg");
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "#9B59B6"
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        ctx.font = "38px cursive";
        ctx.textAlign = "center";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(newMember.displayName, canvas.width / 2, canvas.height / 1.2);

        const avatar = await Canvas.loadImage(newMeber.user.displayAvatarURL({ format: "jpg" }));
        
        ctx.beginPath();
        ctx.arc(125, 125, 100, 0, Math.PI *2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, 25, 25, 200, 200);

        const attachement = new MessageAttachment(canvas.toBuffer(), "arroz fixe.jpg");

        Thankyou.setDescription(`Thank you for boosting the server`)
        Thankyou.setImage('attachment://arroz fixe.jpg')

       await guild.systemChannel.send({ embeds: [Thankyou], files: [attachement] }).catch((err) => console.log(err));
       Thankyou.setDescription(`Thank you for boosting the server :3`)

        newMeber.send({ embeds: [Thankyou]})
      }
    }
}