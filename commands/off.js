const config = require('./../config.json');
const dbcmds = require('./../database');
const util = require('./../util');

exports.desc = "Turns bot off.";

exports.params = [];


exports.run = (client, message, args) => {
	if(!message.member.roles.some(r=>config.admin_roles.includes(r.name)) )
		message.channel.send("You don't have permissions to use this!");

	client.destroy();
	message.channel.send(`Bot was turned off by ${message.author.username}`);

};