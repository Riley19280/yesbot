const config = require('./../../config.json');
const dbcmds = require('./../../database');
const util = require('./../../util');

exports.desc = "Delete a challenge";

exports.params = ['id'];

exports.require_roles = config.admin_roles

exports.run = (client, message, args) => {

    if(args[1] == null)
        return message.channel.send('You must specify a challenge id.')

    return dbcmds.deleteChallenge(args[1])
        .then(() => {
            return message.channel.send('Challenge deleted.')
        })
        .catch(e => {
            console.error(e)
            return message.channel.send('Error deleting challenge.')
        })
}