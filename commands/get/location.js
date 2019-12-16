const config = require('./../../config.json');
const dbcmds = require('./../../database');
const util = require('./../../util');

exports.desc = "Gets a users location";

exports.params = [];

exports.optionalParam = "(@mention, #channel)";


exports.run = (client, message, args) => {
    let mem;
    try {
        mem = message.mentions.members.first();
    } catch (e) {}
    if (!mem) {
        mem = message.member;
    }

    console.log(message.cleanContent)


    dbcmds.getLocation(mem).then(
        function (location){
            if(location == null || location == "")
                message.channel.send(`${mem.user.username} does not have a location set.`);
            else
                message.channel.send(`${mem.user.username}\'s Location: ${location}`);
        }
    ).catch( e => {
        message.channel.send(`An error has occurred when getting the location.`);
        console.error(e)
    })
}