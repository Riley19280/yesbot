const config = require('./../config.json');
const dbcmds = require('./../database');
const util = require('./../util');
var Promise = require("bluebird");

exports.desc = "Gets a users location";

exports.params = [];


exports.optionalParam = "(@mention, #channel)";

exports.run = async (client, message, args) => {
    let m;
    try {
        m = message.mentions.members.first();
    } catch (e) {}
    if (!m) {
        m = message.member;
    }

    let members

    let channel = message.content.match(/<#([0-9]+)>/)
    if(channel != null) {
        channel = channel[1]
        channel = await client.channels.find('id', channel)

        if(["text", "voice"].includes(channel.type))
            members = channel.members
    }

    if(members == null)
        members = [m]

    let result = ""

    Promise.map(members.array(), function(mem) {

        return dbcmds.getLocation(mem).then(location => {
            if (location == null || location == "")
                result += `${mem.displayName} does not have a location set.\n`
            else
                result += `${mem.displayName}\'s Location: ${location}\n`
        }).catch( e => {
            result += `Error getting location for ${mem.displayName}\n`
            console.error(e)
        })
    }).then(() => {

        return message.channel.send(result);
    })


}