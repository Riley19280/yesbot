
const dbcmds = require('./../database');
const util = require('./../util');

exports.desc = "Initializes the guild with all users";

exports.params = [];

exports.require_roles = process.env.ADMIN_ROLES.split('|')

exports.run = (client, message, args) => {
	message.member.guild.members.map(function (mem) {
		console.log(mem.user.username)
	})
}