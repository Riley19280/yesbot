
const dbcmds = require('./../../database');
const util = require('./../../util');

exports.desc = "Delete a meetup";

exports.params = [];


exports.run = async (client, message, args) => {
    let meetup = (await dbcmds.getAllMeetups(message.member.guild)).reduce((a, x) => x.name === message.channel.name.replace(/-/g, ' ') ? x : a, null)

    if(meetup == null)
        return message.channel.send("This command must be used in a meeetup channel.");

    if (!message.member.roles.some(r => process.env.ADMIN_ROLES.split('|').includes(r.name)) && message.member.id !== meetup.ownerID)
        return message.channel.send("You don't have permission to delete that meetup.");

    let announcement_channel = await message.member.guild.channels.find(x => x.name.toLowerCase() === 'announcements' && x.parent && x.parent.name.toLowerCase() === 'meetups')
    let announcement_message = (await announcement_channel.fetchMessages()).find(x => x.embeds.length > 0 && x.embeds[0].title === meetup.name)
    if(announcement_message != null)
        await announcement_message.delete()

    await dbcmds.deleteMeetup(meetup.id)
    let channel = await message.member.guild.channels.get(meetup.channelID)
    if(channel != null)
        channel.delete('Meetup deleted.')

}