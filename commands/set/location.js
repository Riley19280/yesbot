const config = require('./../../config.json');
const dbcmds = require('./../../database');
const util = require('./../../util');


exports.desc = "Set your location.js";

exports.params = ["location"];


exports.run = (client, message, args) => {

    let mem;
    try {
        mem = message.mentions.members.first();
    } catch (e) {}

    if(mem != null) {//if there is a mention
        if (!message.member.roles.some(r => config.admin_roles.includes(r.name))) {
            return message.channel.send("You don't have permission to set others' location.js.");
        }
    }
    else {
        mem = message.member;
    }

    let location = args.splice(1).join(' ')

    dbcmds.setLocation(mem, location).then( e => {
            return message.channel.send(`Location set to ${location}`);
        })
    .catch((e)=>{
        console.error(e)
    });




}