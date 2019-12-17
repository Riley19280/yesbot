const config = require('./../../config.json');
const dbcmds = require('./../../database');
const util = require('./../../util');
const rp = require('request-promise')


exports.desc = "Set your location.js";

exports.params = ["location"];


exports.run = async (client, message, args) => {

    let mem;
    try {
        mem = message.mentions.members.first();
    } catch (e) {}

    if(mem != null) {//if there is a mention
        if (!message.member.roles.some(r => config.admin_roles.includes(r.name))) {
            return message.channel.send("You don't have permission to set others' location.");
        }
    }
    else {
        mem = message.member;
    }

    let location = args.splice(1).join(' ')

    let geocode_url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${config.maps_api_key}`

    let results = JSON.parse(await rp(geocode_url))

    if(results.status === 'ZERO_RESULTS')
        return message.channel.send(`Unable to find that location. Try being more specific (city, state, etc.)`);

    if(results.status === 'OK') {
        let result = results.results[0]
        let proper_address = result.formatted_address
        let lat = result.geometry.location.lat
        let lng = result.geometry.location.lng


        await dbcmds.setLocation(mem, proper_address, lat, lng).then(e => {
            return message.channel.send(`Location set to ${proper_address}`);
        })
        .catch((e) => {
            console.error(e)
        });
    }



}