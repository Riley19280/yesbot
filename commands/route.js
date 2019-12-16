const config = require('./../config.json');
const dbcmds = require('./../database');
const util = require('./../util');
var Promise = require("bluebird");
const rp = require('request-promise')

exports.desc = "Routes users to the specified destination";

exports.params = ["destination"];

exports.optionalParam = "(@mention, #channel)";

exports.run = async (client, message, args) => {
    let members

    try {
        members = message.mentions.members.array();
    } catch (e) {}

    let channel = message.content.match(/<#([0-9]+)>/)
    if(channel != null) {
        channel = channel[1]
        channel = await client.channels.find('id', channel)

        if(["text", "voice"].includes(channel.type))
            members = members.concat(channel.members.array())
    }

    if (members.length === 0) {
        members = [message.member];
    }

    let destination = message.content.replace(/<.*?>/g, '').split(' ').slice(1).join(' ')

    let locations = {}
    let no_location = []

    await Promise.map(members, function(mem) {
        return dbcmds.getLocation(mem).then(location => {
            if(location != null && location !== "")
                locations[mem.displayName] = location
            else
                no_location.push(mem.displayName)
        }).catch( e => {
            console.error(e)
        })
    })

    let units = 'imperial'
    let dist_matrix_url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=${units}&origins=${Object.keys(locations).map(k => locations[k]).join('|')}&destinations=${destination}&key=${config.maps_api_key}`

    let results = JSON.parse(await rp(dist_matrix_url))

    if(results.status !== 'OK') {
        console.error(JSON.stringify(results))
        return message.channel.send('Sorry, an error occurred processing your request')
    }

    let response = `Routing to ${results.destination_addresses[0]}\n`

    let usernames = Object.keys(locations)
    for(let i= 0; i < results.rows.length; i++) {
        response += `${usernames[i]}: ${results.rows[i].elements[0].duration.text}, ${results.rows[i].elements[0].distance.text}\n`
    }

    for(let user of no_location)
        response += `${user} does not have a location set.\n`

    message.channel.send(response)

}