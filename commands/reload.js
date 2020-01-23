
const dbcmds = require('./../database');
const util = require('./../util');

exports.desc = "Reloads the specified command.";

exports.params = ["command"];

exports.require_roles = process.env.ADMIN_ROLES.split('|')

exports.run = (client, message, args) => {

    if(!args || args.size < 1) return message.channel.send("Invalid parameter. Must provide a command name to reload.");
    // the path is relative to the *current folder*, so just ./filename.js

    let aliases = process.env.COMMAND_ALIASES.split('|').reduce((a,x) => {a[x.split('=')[0]] = x.split('=')[1]; return a},{})

    let path = args[0].split('/').map(p => {
        if(Object.keys(aliases).includes(p))
            return aliases[p]
        return p
    }).join('/')


    if(args[0].indexOf('.') !== -1)
        delete require.cache[require.resolve(`./${path}`)];
    else
        delete require.cache[require.resolve(`./${path}.js`)];
    message.channel.send(`${path} has been reloaded.`);
};