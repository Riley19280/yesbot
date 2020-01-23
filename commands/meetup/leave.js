
const dbcmds = require('./../../database');
const util = require('./../../util');

exports.desc = "Leave a meetup group";

exports.params = [];


exports.run = async (client, message, args) => {
    let meetup = (await dbcmds.getAllMeetups(message.member.guild)).reduce((a, x) => x.name === message.channel.name.replace(/-/g, ' ') ? x : a, null)

    if(meetup == null)
        return message.channel.send("This command must be used in a meeetup channel.");

    if(meetup.ownerID === message.member.id)
        return message.channel.send("You cannot leave the meetup as the owner, you may only transfer or delete the meetup.");

    await message.member.guild.channels.get(meetup.channelID).overwritePermissions(message.member, {VIEW_CHANNEL: false})
    await message.delete()
}