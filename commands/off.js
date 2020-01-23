
const dbcmds = require('./../database');
const util = require('./../util');

exports.desc = "Turns bot off.";

exports.params = [];

exports.require_roles = process.env.ADMIN_ROLES.split('|')


exports.run = (client, message, args) => {
	message.channel.send(`Bot was turned off by ${message.author.username}`);
	client.destroy();
};