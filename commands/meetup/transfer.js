
const dbcmds = require('./../../database');
const util = require('./../../util');

exports.desc = "Transfer ownership of a meetup to another person";

exports.params = ['@mention'];


exports.run = async (client, message, args) => {
    let meetup = (await dbcmds.getAllMeetups(message.member.guild)).reduce((a, x) => x.name === message.channel.name.replace(/-/g, ' ') ? x : a, null)

    if(meetup == null)
        return message.channel.send("This command must be used in a meeetup channel.");

    if (!message.member.roles.some(r => process.env.ADMIN_ROLES.split('|').includes(r.name)) && message.member.id !== meetup.ownerID) {
        return message.channel.send("You don't have permission to edit this meetup.");
    }

    let receiver = message.mentions.members.first();
    if(receiver == null)
        return message.channel.send('You need to mention the person you want to transfer ownership to.')

    dbcmds.editMeetupAttribute(meetup.id,'ownerID', receiver.user.id).then(() => {
        return message.channel.send(`Ownership of ${meetup.name} transferred to <@${receiver.user.id}>`)
    })
    .catch(e => {
        console.error(e)
        return message.channel.send(`An error occurred while trying to transfer ownership.`)
    })

}