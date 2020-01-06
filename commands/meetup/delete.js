const config = require('./../../config.json');
const dbcmds = require('./../../database');
const util = require('./../../util');

exports.desc = "Delete a meetup";

exports.params = ['name'];


exports.run = async (client, message, args) => {
    let meetup = (await dbcmds.getAllMeetups(message.member)).reduce( (a, x) => x.name === args.slice(1).join(' ') ? x : a, null)
    if(meetup == null)
        return message.channel.send("Unable to find a meetup with that name.");

    if (!message.member.roles.some(r => config.admin_roles.includes(r.name)) && message.member.id !== meetup.ownerID) {
        return message.channel.send("You don't have permission to delete that meetup.");
    }

    await message.member.guild.channels.get(meetup.channelID).delete('Meetup deleted.')
    await dbcmds.deleteMeetup(meetup.id)

}