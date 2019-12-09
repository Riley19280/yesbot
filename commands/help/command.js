const config = require('./../../config.json');
const dbcmds = require('./../../database');
const util = require('./../../util');

exports.desc = "The name of another command.";

exports.params = [];


exports.run = (client, message, args) => {
	message.channel.send("\"command\" is supposed to be the name of another command.");
}