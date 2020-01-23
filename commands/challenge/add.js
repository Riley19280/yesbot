
const dbcmds = require('./../../database');
const util = require('./../../util');

exports.desc = "Adds a challenge to the list of challenges";

exports.params = ['challenge'];

exports.require_roles = process.env.ADMIN_ROLES.split('')

exports.run = async (client, message, args) => {

    if(args[1] == null)
        return message.channel.send('You must specify a challenge')

    let challenge = args.slice(1).join(' ')
    dbcmds.addChallenge(challenge)
        .then(id => {
            return message.channel.send('Challenge added!')
        })

}