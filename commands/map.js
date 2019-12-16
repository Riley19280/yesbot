const config = require('./../config.json');
const dbcmds = require('./../database');
const util = require('./../util');

exports.desc = "Get the link for the map.";

exports.params = [];


exports.run = async (client, message, args) => {

    //let result = await util.locationKML(message.member.guild.id)

    message.channel.send('https://yestheory.rileystech.com/map')
}

