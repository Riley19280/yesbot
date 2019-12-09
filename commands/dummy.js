const config = require('./../config.json');
const dbcmds = require('./../database');
const util = require('./../util');

exports.desc = "Dummy command";

exports.params = [];


exports.run = (client, message, args) => {
	client.emit("guildMemberAdd", message.member);

	///message.channel.send(message.author.displayAvatarURL)
}