const mongoose = require("mongoose"); // Import mongoose library
const Schema = mongoose.Schema; // Define Schema method
const config = require("./../../config.json");

// Schema
var RoleSchema = new Schema({ // Create Schema
  _id: {type: String, required: true}, // ID of role on Discord
  name: {type: String, required: true}, // the name of the role
  color: String, // the colour of the role, if any
  special: {type: Boolean, default: false}, // if a role is special, there needs to be a vote to give it to a user (otherwise they can choose it themselves)
  set: {type: Number, default: 0} // timestamp of when the role was last changed or set
});

RoleSchema.virtual('id').get(function() {
  return this._id;
});

// Model
var roles = mongoose.model("roles", RoleSchema); // Create collection model from schema
module.exports = roles; // export model
