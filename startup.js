const config = require('./config.json');
const util = require('./util');
const { spawn } = require('child_process')
const dbcmds = require('./database');
const reactionHandler = require('./meetupReactionHandler')
const moment = require('moment');
const momentTimezone = require('moment-timezone');

let webserv, client;

exports.run = (c)=>{
	client = c
	webserv = require('./express')
	webserv.init(client)

	reactionHandler.init(client)

	setInterval(dailyChallengeHandler, 1000 * 1)
};

let lastTrigger = null
async function dailyChallengeHandler() {
	let date = new Date();
	let estDate = moment.tz('America/New_York').toDate();

	if(estDate.getHours() === 12 && estDate.getMinutes() === 00 && estDate.toLocaleString().slice(-2) === 'PM') {
		console.log(date.getHours(), date.getMinutes(), lastTrigger, lastTrigger != null ? date.getTime() - lastTrigger.getTime() : '')
		if(lastTrigger == null || date.getTime() - lastTrigger.getTime() > 80000000) {
			for(let guild of client.guilds.array()) {
				let channel = await guild.channels.find(x => x.name.toLowerCase() === 'name');
				let theChosenMember = guild.members.random();
				if(channel == null) return
				let res = await channel.send(`**${date.toString().match(/.*? .*? .*? /)[0].trim()}:** <@${theChosenMember.id}> => ${(await dbcmds.getChallenge()).message}`);
				console.log(`Daily challenge sent at ${date.toLocaleString()}`)
				lastTrigger = date
			}
		}
	}

}
