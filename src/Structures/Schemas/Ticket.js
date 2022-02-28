const { model, Schema } = require("mongoose");

module.exports = model(
    "Tickets", 
    new Schema({
    GuildID: String,
    MembersID: [String],
    TicketID: String,
    ChannelID: String,
    Cloced: Boolean,
    Locked: Boolean,
    Type: String,
    Claimed: Boolean,
    ClaimedBy: String,
 })
);
