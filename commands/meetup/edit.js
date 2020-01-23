
const dbcmds = require('./../../database');
const util = require('./../../util');
const Discord = require('discord.js')

exports.desc = "Edit a meetups information";

exports.params = ['name','description','date','address','notes'];


exports.run = async (client, message, args) => {

    let meetup = (await dbcmds.getAllMeetups(message.member.guild)).reduce((a, x) => x.name === message.channel.name.replace(/-/g, ' ') ? x : a, null)

    if(meetup == null)
        return message.channel.send("This command must be used in a meeetup channel.");

    if(!exports.params.includes(args[1])) {
        return message.channel.send(`Valid attributes are *<${exports.params.join(', ')}>*`)
    }

    if (!message.member.roles.some(r => process.env.ADMIN_ROLES.split('|').includes(r.name)) && message.member.id !== meetup.ownerID) {
        return message.channel.send("You don't have permission to edit this meetup.");
    }

    let editContent = args.slice(2).join(' ')
    let channel = await message.member.guild.channels.get(meetup.channelID)
    let announcement_channel = await message.member.guild.channels.find(x => x.name.toLowerCase() === 'announcements' && x.parent && x.parent.name.toLowerCase() === 'meetups')

    try {
        await dbcmds.editMeetupAttribute(meetup.id, args[1], editContent)
        let info_message = (await channel.fetchPinnedMessages()).last()
        let announcement_message = (await announcement_channel.fetchMessages()).find(x => x.embeds.length > 0 && x.embeds[0].title === meetup.name)
        if (args[1] === 'name') {
            info_message.embeds[0].title = editContent
            await channel.setName(editContent)
        } else if (args[1] === 'address') {
            let address = await util.geocodeString(editContent)
            editContent = address == null ? 'Unknown' : address.formatted_address
        }

        if(args[1] !== 'name')
            for(let i = 0; i < info_message.embeds[0].fields.length; i++) {
                let f = info_message.embeds[0].fields[i]
                if(f.name.toLowerCase() === args[1])
                    f.value = editContent
            }

        await info_message.edit(new Discord.RichEmbed(info_message.embeds[0]));
        await announcement_message.edit((new Discord.RichEmbed(info_message.embeds[0])).addBlankField().addField('Join the meetup!','React with :thumbsup: to join the meetup chat!'));
    } catch (e) {
        console.error(e)
        return message.channel.send(`An error occurred while trying to edit the meetup. Try again.`)
    }
}