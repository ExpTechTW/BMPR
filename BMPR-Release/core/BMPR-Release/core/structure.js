const { EmbedBuilder } = require('discord.js')

async function embed(msg, color, author, image, icon) {
    if (color == (undefined || null)) {
        color = '#0099ff'
    }
    if (msg.length > 500) return false
    if (author != (undefined || null) && icon != (undefined || null) && image != (undefined || null)) {
        let exampleEmbed = new EmbedBuilder()
            .setColor(color)
            .setDescription(msg)
            .setTimestamp()
            .setImage(image)
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