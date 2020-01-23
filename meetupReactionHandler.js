
const util = require('./util');
const Discord = require('discord.js')
const dbcmds = require('./database');

exports.init = async (client) => {

   await client.guilds.map(async guild => {
       let meetups = await dbcmds.getAllMeetups(guild)
       let announcement_channel = await guild.channels.find(x => x.name.toLowerCase() === 'announcements' && x.parent && x.parent.name.toLowerCase() === 'meetups')
       if(announcement_channel == null)
           return console.log(`Meetup announcement channel not found for ${guild.name}`)
       let messages = (await announcement_channel.fetchMessages()).filter(x => x.embeds.length > 0)
        messages.map(message => {
            let meetup = meetups.reduce((a,e) => e.name === message.embeds[0].title ? e : a, null)
            if(meetup == null)
                return console.error(`Unable to find a meetup for message ${message.id} ${message.embeds[0].title} in channel ${message.channel.name} in guild ${guild.name}`)

            return exports.registerMeeetupListener(message, meetup.channelID)
        })
    })
}


exports.registerMeeetupListener = (message, meetupChannelID) => {

    const filter = (reaction, user) => {
        return reaction.emoji.name === '👍';
    };

    const collector = new Discord.ReactionCollector(message, filter);


    collector.on('collect', (reaction, reactionCollector) => {
        for(let user of reaction.users.array()) {
            try {
                message.member.guild.channels.get(meetupChannelID).overwritePermissions(user, {VIEW_CHANNEL: true})
            } catch (e) {
                console.error(e)
            }
        }
    });


    collector.on('end', collected => {
        console.log(`Collection ended.`);
    });
}