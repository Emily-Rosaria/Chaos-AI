const mongoose = require("mongoose"); //database library
const config = require('./../../config.json'); // load bot config
const Users = require("./../../database/models/users.js"); // users model
const Docs = require("./../../database/models/documents.js"); // users model

module.exports = {
    name: 'newdoc', // The name of the command
    aliases: ['adddoc','addpasta','newpasta','addnote','newnote','copy'],
    description: 'Adds a text "document" that the bot can repost whenever. Overwrites any doc the user has saved if the name is identical. Pings and mentions are removed, so use plaintext if you wish to reference another user.', // The description of the command (for help text)
    perms: 'user',
    allowDM: true,
    args: 2,
    usage: '<name> <content>', // Help text to explain how to use the command (if it had any arguments)
    async execute(message, args) {
      var userID = message.author.id;

      var title = "";
      if (args[0].startsWith('"')) {
        const quotes = message.content.split('"');
        title = '"'+quotes[1];
        title = quotes.length > 2 ? title + '"' : title;
      } else {
        title = args[0];
      }
      const names = "("+this.aliases.concat(this.name).join('|')+")";
      const regex1 = new RegExp(`^\\S+ *${names} +`, 'g');
      const regex2 = new RegExp(`^ *${title}`, 'g');
      var content = message.content.trim().replace(regex1,"").replace(regex2,"");
      title = title.replace(/ {2,}/," ").toLowerCase().trim().replace(/"/g,"");

      if (!content || content == "") {
        return message.reply(`Invalid content for your ${title} document. Make sure to write at least two arguments for the command. If the name value is multiple words, write it within "quotation marks". Don't write the content within these symbols.`);
      }

      var options = { upsert: true, setDefaultsOnInsert: true };

      var update = {};
      update["documents."+title] = message.id;
      update = {"$set":update};
      const data = await Users.findOneAndUpdate({_id: message.author.id},update,options).exec();

      await Docs.create({
        _id: message.id,
        name: title,
        content: content,
        user: userID,
        type: "text"
      });

      if (data && data.documents && data.documents.has(title)) {
        await Docs.findByIdAndRemove(data.documents.get(title)).exec();
        message.reply("An old copypasta with that name was overwritten with the new text provided! Use the `$doc "+title+"` command to have the bot say it.");
      } else {
        message.reply("Your copypasta has been created! Use the `$doc "+title+"` command to have the bot say it.");
      }
    },
};
