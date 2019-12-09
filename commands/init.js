const config = require('./../config.json');
const dbcmds = require('./../database');
const util = require('./../util');

exports.desc = "Initializes the guild with all users";

exports.params = [];


exports.run = (client, message, args) => {
	if (message.member.roles.some(r => config.admin_roles.includes(r.name))) {

		message.member.guild.members.map(function (mem) {
			console.log(mem.user.username)
		})

	}else {
		return message.channel.send("You don't have permission to use init.");
	}
}