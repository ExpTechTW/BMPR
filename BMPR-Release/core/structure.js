const { EmbedBuilder } = require('discord.js')

async function embed(msg, color, author, icon) {
    if (color == (undefined || null)) {
        color = '#0099ff'
    }
    if (msg.length > 500) return false
    if (author != (undefined || null) && icon != (undefined || null)) {
        let exampleEmbed = new EmbedBuilder()
            .setColor(color)
            .setDescription(msg)
            .setTimestamp()
            .setFooter({ text: author, iconURL: icon })
        return { embeds: [exampleEmbed] }
    } else {
        const exampleEmbed = new EmbedBuilder()
            .setColor(color)
            .setDescription(msg)
            .setTimestamp()
        return { embeds: [exampleEmbed] }
    }
}

module.exports = {
    embed
}