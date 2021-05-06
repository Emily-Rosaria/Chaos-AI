const mongoose = require("mongoose"); // Import mongoose library
const Schema = mongoose.Schema; // Define Schema method
const config = require("./../../config.json");

// Schema
var UserSchema = new Schema({ // Create Schema
  _id: {type: String, required: true}, // ID of user on Discord
  bot: {type: Boolean, default: false},
  wordcounts: {
    type: Map,  // key-value pairs of a string (word/phrase)
    of: Number // and a number (how many times it's said)
  },
  documents: {
    type: Map,  // key-value pairs of a string (that invokes the command)
    of: String // and a string "ID", the _id of the document and the id of the discord message that created it
  },
  words: [String], // array of other words to list when showing wordcounts
  vote_points: {type: Number, default: 0}, // number of points a user has to suggest votes on things
  vote_update: {type: Number, default: 0} // when a user's vote points were last updated/changed
});

UserSchema.virtual('id').get(function() {
  return this._id;
});

// Model
var users = mongoose.model("users", UserSchema); // Create collection model from schema
module.exports = users; // export model
