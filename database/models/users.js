const mongoose = require("mongoose"); // Import mongoose library
const Schema = mongoose.Schema; // Define Schema method
const config = require("./../../config.json");

// Schema
var PointSchema = new Schema({ // Create Schema
  value: {type: Number, default: 0}, // value
  updated: {type: Number, default: 0} // timestamp of when it was last updated
});

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
  votes: PointSchema, // points a user can use to start votes
  xp: PointSchema, // server activity
  tokens: PointSchema // tokens are given when another user things you're cool - they're for bragging rights and nothing more
});

UserSchema.virtual('id').get(function() {
  return this._id;
});

// Model
var users = mongoose.model("users", UserSchema); // Create collection model from schema
module.exports = users; // export model
