const Discord = require('discord.js')
const config = require('./../../config.json');
const dbcmds = require('./../../database');
const util = require('./../../util');

exports.desc = "Create a meetup!";

exports.params = ["name"];
module.exports.cm = createMeetup

exports.run = async (client, message, args) => {
    let prev_messages = message.channel.messages.last(15)

    let responses = {
        welcome: 'Meetup creation started',
        name: 'What would you like to name the meetup?',
        date: 'When is the meetup taking place?',
        address: 'Where is the meetup taking place?',
        description: 'What will be happening at the meetup?',
        notes: 'Additional notes about the meetup.',
        finished: 'Meetup event created!'
    }

    // console.log(prev_messages)

    if(args.length === 1 && args[0] === 'create') {
        message.channel.send(responses.welcome + ` <@${message.member.id}>!\n${responses.name}`)
    } else if (args.length === 2 && args[1] === 'inprogress') {

        let original_msg = prev_messages.filter(e => e.content.indexOf(responses.welcome) !== -1 && e.content.indexOf(responses.finished) === -1 )
        if(original_msg.length === 0) return
        original_msg = original_msg[original_msg.length-1]

        if(original_msg.mentions.members.first().id !== message.member.id) return

        let questions = Object.keys(responses).filter(e => !['welcome'].includes(e))
        for(let k = 0; k < questions.length; k++) {
            let key = questions[k]
            // console.log(key)
            // console.log(key, k, responses[questions[k+1]], questions[k+1], k+1)
            if(original_msg.content.indexOf(responses[key]) !== -1) {
                let response = original_msg.content.replace(responses[key], `${key}: ${message.content}`)
                response  += `\n${responses[questions[k+1]]}`
                message.delete()
                await original_msg.edit(response)

                if(questions[k+1] === 'finished') {
                    let meetup_responses  = {}
                    original_msg.content
                        .split('\n')
                        .filter(e => e.indexOf(':') !== -1)
                        .map(e => e.split(':'))
                        .map(e => meetup_responses[e.shift()] = e.join(':').trim())
                    await createMeetup(original_msg.mentions.members.first(), meetup_responses)
                }
                break
            }
        }
    }

}


async function createMeetup(member, meetup_responses, original_msg) {
    let meetup_id = await dbcmds.createMeetup(member, meetup_responses)
    console.log('meetup id', meetup_id)

    let category = member.guild.channels.find(x => x.name === 'Meetups')
    if(category == null) {
        console.error(`unable to find Category \'Meetups\' in guild ${member.guild.name}`)
        return
    }
    let channel = await member.guild.createChannel(meetup_responses.name,
{
            type: 'text',
            parent: category,
            permissionOverwrites: [
                {
                    id: member.guild.defaultRole.id,
                    deny: ['VIEW_CHANNEL']
                },
                {
                    id: member.id,
                    allow: ['VIEW_CHANNEL']
                }
            ]
        }
    )

    let embed = new Discord.RichEmbed()
        .setTitle(meetup_responses.name)
        .setColor('#0166ff')
        .addField('Description', meetup_responses.description)
        .addField('Date', meetup_responses.date)
        .addField('Address', (await util.geocodeString(meetup_responses.address)).formatted_address)
        .addField('Notes', meetup_responses.notes)
    await channel.send(embed).then(m => m.pin())


    await dbcmds.setMeetupChannel(meetup_id, channel.id)
}

