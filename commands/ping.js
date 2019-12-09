const config = require('./../config.json');
const dbcmds = require('./../database');
const util = require('./../util');

exports.desc = "Pings the bot.";

exports.params = [];


exports.run = (client, message, args) => {
	message.channel.send('Pong!');
	console.log('pong: '+ message.author.username);
}