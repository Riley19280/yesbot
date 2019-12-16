const config = require('./../config.json');
const dbcmds = require('./../database');
const util = require('./../util');

exports.desc = "Dummy command";

exports.params = [];

exports.require_roles = config.admin_roles

exports.run = (client, message, args) => {

	if(args[1] === "guildMemberAdd")
		client.emit("guildMemberAdd", message.member);

	///message.channel.send(message.author.displayAvatarURL)
}