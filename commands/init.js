const config = require('./../config.json');
const dbcmds = require('./../database');
const util = require('./../util');

exports.desc = "Initializes the guild with all users";

exports.params = [];

exports.require_roles = config.admin_roles

exports.run = (client, message, args) => {
	message.member.guild.members.map(function (mem) {
		console.log(mem.user.username)
	})
}