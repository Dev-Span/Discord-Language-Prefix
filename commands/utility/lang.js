const fs = require("fs");
const db = require("quick.db")
const { MessageEmbed } = require("discord.js")
const { PREFIX } = require("../../config")

module.exports = {
    config: {
        name: "prefix",
        description: "Chnage/Know The server's Prefix or the Global Prefix",
        usage: "m/prefix <new prefix/reset>",
        example: "1) m/prefix = \n2) m/prefix reset",
        aliases: ["prefix"]
    },

    run: async (bot, message, args) => {

  let language = db.fetch(`lang_${message.guild.id}`)
  if (language === null) language = client.config.mainLang
  const lang = require(`../lang/${language}.js`)

  const mg = new Discord.MessageEmbed()
    .setColor("RED")
    .setDescription(lang.lang.mg)

  const msg = new Discord.MessageEmbed()
    .setColor("RED")
    .setDescription(lang.lang.msg + `\`${prefix}${lang.lang.msg2}\``)

  if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(mg)
  if (!args[0]) return message.channel.send(msg);


  if (args[0] === "en") {
    const err = new Discord.MessageEmbed()
      .setColor("RED")
      .setDescription(lang.lang.err)

    if (language === "en") return message.channel.send(err)
    db.set(`lang_${message.guild.id}`, "en")

    const embed = new Discord.MessageEmbed()
      .setColor("GREEN")
      .setDescription(":flag_us: The language has been changed to `English`")
    message.channel.send(embed).then(messageToReact => {
      messageToReact.react("<a:LunaYes:817452322418196535>");
    })
  }

  if (args[0] === "tr") {
    const err = new Discord.MessageEmbed()
      .setColor("RED")
      .setDescription(lang.lang.err)

    if (language === "tr") return message.channel.send(err)
    db.set(`lang_${message.guild.id}`, "tr")

    const embed = new Discord.MessageEmbed()
      .setColor("GREEN")
      .setDescription(":flag_tr: Dil `Türkçe` olarak değiştirildi")
    message.channel.send(embed).then(messageToReact => {
      messageToReact.react("<a:LunaYes:817452322418196535>");
    })
  }


};