const config = require('./../../config.json');
const dbcmds = require('./../../database');
const util = require('./../../util');

exports.desc = "Create a meetup!";

exports.params = ["name"];


exports.run = (client, message, args) => {

    console.log(args)

    let prev_messages = message.channel.messages.last(15).map( e => {
        return {
            user: e.author.id,
            message: e.content
        }
    })

    let responses = {
        welcome: 'Meetup creation started',
        name: 'Enter a name for the meetup',
        date: 'When is the meetup taking place?',
        address: 'Where is the meetup taking place?',
        description: 'Describe the meetup event.',
        notes: 'Additional notes about the meetup.',
        finished: 'Meetup event created!'
    }

    if(args.length === 1 && args[0] === 'create') {
        message.channel.send(responses.welcome + ` <@${message.member.id}>!`)
        return message.channel.send(responses.name)
    } else if (args.length === 2 && args[1] === 'inprogress') {

        if(prev_messages.filter(e => e.message === responses.finished).length !== 0)
            return

        if(prev_messages.filter(e => e.message === responses.notes).length !== 0)
            return message.channel.send(responses.finished)

        if(prev_messages.filter(e => e.message === responses.description).length !== 0)
            return message.channel.send(responses.notes)

        if(prev_messages.filter(e => e.message === responses.address).length !== 0)
            return message.channel.send(responses.description)

        if(prev_messages.filter(e => e.message === responses.date).length !== 0)
            return message.channel.send(responses.address)

        if(prev_messages.filter(e => e.message === responses.name).length !== 0)
            return message.channel.send(responses.date)
    }




}