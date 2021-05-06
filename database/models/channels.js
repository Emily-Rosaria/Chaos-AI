const mongoose = require("mongoose"); // Import mongoose library
const Schema = mongoose.Schema; // Define Schema method
const config = require("./../../config.json");

// Schema
var ChannelSchema = new Schema({ // Create Schema
  _id: {type: String, required: true}, // ID of channel on Discord
  type: {type: String, required: true}, // the category the channel is under
  name: {type: String, required: true}, // channel name
  topic: String, // channel topic
  set: {type: Number, default: 0} // timestamp of when the channel was last changed or set
});

ChannelSchema.virtual('id').get(function() {
  return this._id;
});

// Model
var channels = mongoose.model("channels", ChannelSchema); // Create collection model from schema
module.exports = channels; // export model
