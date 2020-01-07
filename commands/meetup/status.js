const config = require('./../../config.json');
const dbcmds = require('./../../database');
const util = require('./../../util');

exports.desc = "Set your status for the meetup";

exports.params = ['status', 'status all'];


exports.run = async (client, message, args) => {
    let meetup = (await dbcmds.getAllMeetups(message.member.guild)).reduce((a, x) => x.name === message.channel.name.replace(/-/g, ' ') ? x : a, null)

    if(meetup == null)
        return message.channel.send("This command must be used in a meeetup channel.");

    if(args[1] === 'all') {
        let msg = ''
        let statuses = await dbcmds.getMeetupStatus(meetup.id, message.member, true)
        for(let s of statuses)
            msg += `${s.username}: ${s.status}\n`

        if(msg === '')
            msg = 'No members have set a status.'
        return message.channel.send(msg)
    }

    let mention = message.mentions.members.first();

    if (!mention && (args[1] !== undefined)) {

        await dbcmds.setMeetupStatus(meetup.id, message.member, args.slice(1).join(' '))
        return message.channel.send(`Status set to ${args.slice(1).join(' ')}`)
    }

    let mem = mention != null ? mention : message.member

    let statuses = await dbcmds.getMeetupStatus(meetup.id, mem)

    if(statuses.length > 0)
        return message.channel.send(`${mem.displayName}'s status: ${statuses[0].status}`)
    else
        return message.channel.send(`${mem.displayName} does not have a status set`)





}