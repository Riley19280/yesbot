
const dbcmds = require('./../database');
const util = require('./../util');

exports.desc = "Dummy command";

exports.params = [];


exports.run = async (client, message, args) => {
	// await require('./meetup/create').cm(message.member, { name: 'name',
	// 	date: 'when',
	// 	address: 'where',
	// 	description: 'what',
	// 	notes: 'notes' },
    //     {content:'Meetup creation started <@357291574532767745>!\n' +
    //     'name: name\n' +
    //     'date: when\n' +
    //     'address: where\n' +
    //     'description: wha\n' +
    //     'notes: notes\n' +
    //     'Meetup event created!'}
	// )
	///message.channel.send(message.author.displayAvatarURL)
}