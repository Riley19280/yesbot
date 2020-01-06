const config = require('./../../config.json');
const dbcmds = require('./../../database');
const util = require('./../../util');
const Discord = require('discord.js')

exports.desc = "Edit a meetups information";

exports.params = ['name','description','date','address','notes'];


exports.run = async (client, message, args) => {

    let meetup = (await dbcmds.getAllMeetups(message.member)).reduce((a, x) => x.name === message.channel.name.replace(/-/g, ' ') ? x : a, null)

    if(meetup == null)
        return message.channel.send("This command must be used in a meeetup channel.");

    if(!exports.params.includes(args[1])) {
        return message.channel.send(`Valid attributes are *<${exports.params.join(', ')}>*`)
    }

    if (!message.member.roles.some(r => config.admin_roles.includes(r.name)) && message.member.id !== meetup.ownerID) {
        return message.channel.send("You don't have permission to edit this meetup.");
    }

    let editContent = args.slice(2).join(' ')
    let channel = await message.member.guild.channels.get(meetup.channelID)

    try {
        await dbcmds.editMeetupAttribute(meetup.id, args[1], editContent)
        let info_message = (await channel.fetchPinnedMessages()).first()
        if (args[1] === 'name') {
            info_message.embeds[0].title = editContent
            await channel.setName(editContent)
        } else if (args[1] === 'address') {
            info_message.embeds[0].fields[exports.params.indexOf(args[1]) - 1].value = (await util.geocodeString(editContent)).formatted_address
        } else {
            info_message.embeds[0].fields[exports.params.indexOf(args[1]) - 1].value = editContent
        }
        await info_message.edit(new Discord.RichEmbed(info_message.embeds[0]));
    } catch (e) {
        console.error(e)
        return message.channel.send(`An error occurred while trying to edit the meetup. Try again.`)
    }
}