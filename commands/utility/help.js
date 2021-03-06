var Discord = require('discord.js')
const fs = require("fs")
const { PREFIX } = require("../../config")
const db = require('quick.db')
const { stripIndents } = require("common-tags");

module.exports = {
    config: {
        name: "help",
        description: "Help Menu",
        usage: "1) m/help \n2) m/help [module name]\n3) m/help [command (name or alias)]",
        example: "1) m/help\n2) m/help utility\n3) m/help ban",
        aliases: ['h']
    },
    run: async (bot, message, args) => {
        let prefix;
        if (message.author.bot || message.channel.type === "dm") return;
        try {
            let fetched = await db.fetch(`prefix_${message.guild.id}`);
            if (fetched == null) {
                prefix = PREFIX
            } else {
                prefix = fetched
            }
        } catch (e) {
            console.log(e)
        };

        let language = db.fetch(`lang_${message.guild.id}`)
        if (language === null) language = "en"
        const lang = require(`../../lang/${language}.js`)

        if (message.content.toLowerCase() === `${prefix}help`) {
            var log = new Discord.MessageEmbed()
                .setTitle("**Help Menu: Main**")
                .setColor(`#d9d9d9`)
                .addField(`**⚙️Utility**`, `[\`${prefix}help util\` ]`, true)
                .setDescription(`**[Github](https://github.com/Dev-Span/Discord-Language-Prefix)**`)

            message.channel.send(log);
        }
        else if (args[0].toLowerCase() === "util") {
            var commandArray = `
1) ${prefix}prefix
2) ${prefix}lang
`
            var commandA2 = `
Nothing to see here
`

            pageN1 = "**\n💠Commands: **\n`\`\`js\n" + commandArray + "\`\`\`" + `**[Github](https://github.com/Dev-Span/Discord-Language-Prefix/)**`;
            pageN2 = "**\n💠Commands: **\n`\`\`js\n" + commandA2 + "\`\`\`" + `**[Github](https://github.com/Dev-Span/Discord-Language-Prefix/)**`;

            let pages = [pageN1, pageN2]
            let page = 1

            var embed = new Discord.MessageEmbed()
                .setTitle('**Help Menu: [Utility]⚙️**')
                .setColor("#d9d9d9") // Set the color
                .setFooter(`Page ${page} of ${pages.length}`, bot.user.displayAvatarURL())
                .setDescription(pages[page - 1])

            message.channel.send({ embed }).then(msg => {
                msg.react('⬅').then(r => {
                    msg.react('➡')

                    // Filters
                    const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅' && user.id === message.author.id
                    const forwardsFilter = (reaction, user) => reaction.emoji.name === '➡' && user.id === message.author.id

                    const backwards = msg.createReactionCollector(backwardsFilter, { timer: 6000 })
                    const forwards = msg.createReactionCollector(forwardsFilter, { timer: 6000 })

                    backwards.on('collect', (r, u) => {
                        if (page === 1) return r.users.remove(r.users.cache.filter(u => u === message.author).first())
                        page--
                        embed.setDescription(pages[page - 1])
                        embed.setFooter(`Page ${page} of ${pages.length}`, bot.user.displayAvatarURL())
                        msg.edit(embed)
                        r.users.remove(r.users.cache.filter(u => u === message.author).first())
                    })

                    forwards.on('collect', (r, u) => {
                        if (page === pages.length) return r.users.remove(r.users.cache.filter(u => u === message.author).first())
                        page++
                        embed.setDescription(pages[page - 1])
                        embed.setFooter(`Page ${page} of ${pages.length}`, bot.user.displayAvatarURL())
                        msg.edit(embed)
                        r.users.remove(r.users.cache.filter(u => u === message.author).first())
                    })


                })
            })
        }
    }

}