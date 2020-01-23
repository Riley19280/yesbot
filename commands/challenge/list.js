
const dbcmds = require('./../../database');
const util = require('./../../util');

exports.desc = "lists all challenges";

exports.params = [];


exports.run = async (client, message, args) => {
    let msg = ''
    let challenges = await dbcmds.getAllChallenges()
    for(let c of challenges)
        msg += `**${c.id})** ${c.message}\n`

    if(msg === '')
        msg = '**No challenges.**'

    let msgs = msg.match(/(.|\n){1,2000}/g)
    for(let m of msgs)
        await message.channel.send(m)
}


