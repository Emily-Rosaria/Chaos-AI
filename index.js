require('dotenv').config(); //for .env file

// Bot stuff below

const Reddit = require('reddit'); // Reddit
const fetch = require('node-fetch'); // This lets me get stuff from api.
const Booru = require('booru'); // This lets me get stuff from weeb sites.
const fs = require('fs'); // Loads the Filesystem library
const path = require("path"); // Resolves file paths
const Discord = require('discord.js'); // Loads the discord API library
const Canvas = require('canvas'); // Pretty pictures
const readline = require('readline');
const {google} = require('googleapis');

const config = require('./config.json'); // load bot config

const mongoose = require("mongoose"); //database library
const connectDB = require("./database/connectDB.js"); // Database connection
const database = config.dbName; // Database name

const Listeners = require("./database/models/listeners.js"); // listeners model

const client = new Discord.Client({ws: { intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_MESSAGE_TYPING', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_TYPING']}, partials: ['MESSAGE', 'CHANNEL', 'REACTION']}); // Initiates the client

client.commands = new Discord.Collection(); // Creates an empty list in the client object to store all commands

// function to find all js files in folder+subfolders
const getAllCommands = function (dir, cmds) {
  files = fs.readdirSync(dir, { withFileTypes: true });
  fileArray = cmds || [];
  files.forEach((file) => {
    if (file.isDirectory()) {
      const newCmds = fs.readdirSync(dir + '/' + file.name);
      fileArray = fileArray.concat(newCmds.map((f) => dir + '/' + file.name + '/' + f));
    } else if (file.name.endsWith('.js')) {
      fileArray = fileArray.concat([dir + '/' + file.name]);
    }
  });
  return fileArray;
};
const commandFiles = getAllCommands('./commands').filter(file => file.endsWith('.js')); // Loads the code for each command from the "commands" folder

// Loops over each file in the command folder and sets the commands to respond to their name
for (const file of commandFiles) {
    const command = require(file);
    client.commands.set(command.name, command);
}

client.cooldowns = new Discord.Collection(); // Creates an empty list for storing timeouts so people can't spam with commands

// load the core events into client
client.events = new Discord.Collection();
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    client.events.set(event.name, event);
}

// Starts the bot and makes it begin listening for commands.
client.on('ready', function() {
    client.user.setPresence({ status: 'online' }); // activity: { type: 'PLAYING', name: 'with Chaos' }
    console.log(`${client.user.username} is up and running! Launched at: ${(new Date()).toUTCString()}.`);
    client.listeners = new Discord.Collection();
    Listeners.find({},function(err,arr) {
      if (err) {
        return console.error(err);
      }
      if (!arr || arr.length == 0) {
        return console.log("No message listeners found.");
      }
      for (const lis of arr) {
        client.listeners.set(lis._id,lis.channelID);
      }
      console.log(`${arr.length} fetched listener data.`);
    });
});

client.on('message', message => {
    if (!message || !message.author || message.author.bot) {
      return; // don't respond to bots
    }
    client.events.get("onMessage").event(message);
});

client.on('messageDelete', message => {
    if (!message.author || message.author.bot) {return} // don't respond to bots
    client.events.get("onDelete").event(message);
});

client.on('messageUpdate', (oldMessage, newMessage) => {
    if (!newMessage.author || newMessage.author.bot) {return} // don't respond to bots
    client.events.get("onEdit").event(oldMessage, newMessage);
});

client.on('messageReactionAdd', (reaction, user) => {
    if (!user || user.bot) {return}
    client.events.get("onReactionAdd").event(reaction, user);
});

client.on('messageReactionRemove', (reaction, user) => {
    if (!user || user.bot) {return}
    client.events.get("onReactionRemove").event(reaction, user);
});

client.on('messageReactionRemoveEmoji', (reaction) => {
    client.events.get("onReactionTake").event(reaction); // when all reactions for a specific emoji are removed from a message (by a bot)
});

client.on('messageReactionRemoveAll', (message) => {
    client.events.get("onReactionClear").event(message);
});

connectDB("mongodb://localhost:27017/"+database);

client.login(process.env.TOKEN); // Log the bot in using the token provided in the .env file
