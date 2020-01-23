
const dbcmds = require('./../../database');
const util = require('./../../util');



exports.desc = "Set your location.js";

exports.params = ["location"];


exports.run = async (client, message, args) => {

    let mem;
    try {
        mem = message.mentions.members.first();
    } catch (e) {}

    if(mem != null) {//if there is a mention
        if (!message.member.roles.some(r => process.env.ADMIN_ROLES.split('|').includes(r.name))) {
            return message.channel.send("You don't have permission to set others' location.");
        }
    }
    else {
        mem = message.member;
    }

    let location = args.splice(1).join(' ')

    let geo_data = await util.geocodeString(location)

    if(geo_data == null)
        return message.channel.send(`Unable to find that location. Try being more specific (city, state, etc.)`);

    let proper_address = geo_data.formatted_address
    let lat = geo_data.geometry.location.lat
    let lng = geo_data.geometry.location.lng


    await dbcmds.setLocation(mem, proper_address, lat, lng).then(e => {
        return message.channel.send(`Location set to ${proper_address}`);
    })
    .catch((e) => {
        console.error(e)
    });
}

