const mongoose = require("mongoose"); // Import mongoose library
const Schema = mongoose.Schema; // Define Schema method
const config = require("./../../config.json");

// Schema
var ListenerSchema = new Schema({ // Create Schema
  _id: {type: String, required: true}, // ID of message on Discord
  channelID: {type: String, required: true}, // ID of channel on Discord
  guildID: {type: String, required: true}, // ID of guild on Discord
  roles: {
    type: Map,  // the ID of each role
    of: String // the emote that gives that role
  },
  remove: {type: Boolean, default: true}, // whether to remove roles on reaction removal
  exclusive: {type: Boolean, default: false}, // whether to only allow one role in the set
  set: {type: Number, default: 0} // timestamp of when the listener message was last changed or set
});

ListenerSchema.virtual('id').get(function() {
  return this._id;
});

ListenerSchema.virtual('messageID').get(function() {
  return this._id;
});

// Model
var listeners = mongoose.model("listeners", ListenerSchema); // Create collection model from schema
module.exports = listeners; // export model
