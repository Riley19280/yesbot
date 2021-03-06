
const util = require('./util');
const { spawn } = require('child_process')
const dbcmds = require('./database');
const reactionHandler = require('./meetupReactionHandler')
const moment = require('moment');
const momentTimezone = require('moment-timezone');

const ikeaAlerter = require('./ikeaAlerter')

let webserv, client;

exports.run = (c) => {
	client = c
	webserv = require('./express')
	webserv.init(client)
	reactionHandler.init(client)

	setInterval(dailyChallengeHandler, 1000 * 15)



	if(process.env.ENABLE_IKEA_NOTIFIER == true) {
		console.log(`IKEA Notifier: Enabled`)
		setInterval(ikeaAlerter.checkIKEA, 1000 * 60 * 5)
	} else {
		console.log(`IKEA Notifier: Disabled`)
	}

};

let lastTrigger = null
async function dailyChallengeHandler() {
	let estDate = moment.tz('America/New_York');

	if (estDate.hours() === 8 && estDate.minutes() === 0) {
		if (lastTrigger == null || estDate.valueOf() - lastTrigger.valueOf() > 80000000) {
			for (let guild of client.guilds.array()) {
				let channel = await guild.channels.find(x => x.name.toLowerCase() === 'daily-challenge');
				let theChosenMember = guild.members.filter(x => !x.user.bot).random();
				if (channel == null) continue
				let res = await channel.send(`**${estDate.format('ddd, MMM Do')}:** <@${theChosenMember.id}> => ${(await dbcmds.getChallenge()).message}`);
				console.log(`Daily challenge sent at ${estDate.format('LLLL')}`)
			}
            lastTrigger = estDate
		}
	}

}

