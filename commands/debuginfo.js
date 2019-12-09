const config = require('./../config.json');
const dbcmds = require('./../database');
const util = require('./../util');
const request = require('request-promise');

exports.desc = "Prints debug info";

exports.params = ["channels","roles","guilds","users"];


exports.run = (client, message, args) => {
	if(!message.member.roles.some(r=>config.admin_roles.includes(r.name)) ){
			return message.channel.send("You don't have permissions to use this!");
		}
		switch(args[0]){
			case "channels":
				message.channel.send(message.member.guild.channels.map(g => g.name + ' '+ g.id ).join("\n"));
			break;
			case "roles":
				message.channel.send(message.member.guild.roles.map(g => g.name + ' '+ g.id ).join("\n"));
			break;
			
			case "guilds":
				message.channel.send(client.guilds.map(g => g.name + ' '+ g.id ).join("\n"));
			break;
			case "users":
				console.log(client.guilds.length)
				message.channel.send(message.member.guild.members.map(g => g.user.username + ' '+ g.id ).join("\n"));
				break;
		default:
			message.channel.send("Invalid parameter");
			break;
		}
}