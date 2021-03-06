const mongoose = require("mongoose"); //database library
const config = require('./../../config.json'); // load bot config
const adjectives = require('./../../assets/adjectives.json');
const nouns = require('./../../assets/nouns.json');
const Discord = require('discord.js'); // Embed stuff

module.exports = {
    name: 'confess', // The name of the command
    aliases: ['hottake','anon','anony','anonymous'],
    description: 'Posts a super secret message in the hot takes/anonymous channel for you. No one else besides you will know who sent it. Use this command in DMs with the bot.', // The description of the command (for help text)
    perms: 'user',
    allowDM: true,
    cooldown: 10,
    usage: '<anonymous-message>', // Help text to explain how to use the command (if it had any arguments)
    async execute(message, args) {
      if (message.channel.type != "dm") {
        return message.reply("This command only works in DMs. Message the bot directly to use it. For example, you might send the bot this message:\n> \"`$confess I think orange juice is disgusting.`\"");
      } else if (args.length == 0) {
        return message.reply("That command requires more details!\nThe proper usage would be: `$confess <anonymous-message>`.");
      }
      var guild = message.client.guilds.resolve(config.guild);
      if (!guild || !guild.available) {
        return message.reply("I'm having trouble connecting to the anonymous/\"hot takes\" channel on the server at the moment, try again in a bit.");
      }
      var channel = guild.channels.resolve(config.channels.confess);
      if (!channel) {
        return message.reply("I'm having trouble finding the confession/\"hot takes\" channel. Check with an admin to make sure it's visible and available to bots and users.");
      }
      var perms = channel.permissionsFor(message.author.id);
      if (!perms.has("VIEW_CHANNEL") || !perms.has("SEND_MESSAGES")) {
        return message.reply("You don't seem to have permission to view or send messages in the confession/\"hot takes\" channel.");
      }

      const colors = ["#000000","#1ABC9C","#11806A","#2ECC71","#1F8B4C","#3498DB","#206694","#9B59B6","#71368A","#E91E63","#AD1457","#F1C40F","#C27C0E","#E67E22","#A84300","#E74C3C","#992D22","#95A5A6","#979C9F","#7F8C8D","#BCC0C0","#34495E","#2C3E50","#FFFF00","#FFFFFF"];
      const randomColor = colors[Math.floor(Math.random()*colors.length)];

      var randomName = adjectives[Math.floor(Math.random()*adjectives.length)] + " " + nouns[Math.floor(Math.random()*nouns.length)];
      if (["a","e","i","o","u"].includes(randomName.charAt(0).toLowerCase())) {
        randomName = "an " + randomName;
      } else {
        randomName = "a " + randomName;
      }
      randomName = randomName.split(" ").map(s=>{
        return s.charAt(0).toUpperCase() + s.slice(1);
      }).join(" ");
      const randomIcon = "https://robohash.org/" + randomName.replace("[^\w\d]","");

      const anonText = args.join(" ");

      const embed = new Discord.MessageEmbed()
      .setColor(randomColor)
      .setAuthor(randomName,encodeURI(randomIcon))
      .setDescription(anonText)
      .setFooter("An anonymous user submitted this message via the \"confess\" command")
      .setTimestamp();
      channel.send(embed);
    },
};
