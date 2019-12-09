const config = require('./../config.json');
const dbcmds = require('./../database');
const util = require('./../util');

exports.desc = "Reloads the specified command.";

exports.params = ["command"];


exports.run = (client, message, args) => {

	if(!message.member.roles.some(r=>config.admin_roles.includes(r.name)) )
		return message.channel.send("You don't have permissions to use this!");

    if(!args || args.size < 1) return message.channel.send("Invalid parameter. Must provide a command name to reload.");
    // the path is relative to the *current folder*, so just ./filename.js

    let path = args[0].split('/').map(p => {
        if(Object.keys(config.aliases).includes(p))
            return config.aliases[p]
        return p
    }).join('/')


    if(args[0].indexOf('.') !== -1)
        delete require.cache[require.resolve(`./${path}`)];
    else
        delete require.cache[require.resolve(`./${path}.js`)];
    message.channel.send(`${path} has been reloaded.`);
};