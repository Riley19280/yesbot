const config = require('./config.json');
const util = require('./util');
const { spawn } = require('child_process')
const reactionHandler = require('./meetupReactionHandler')

let webserv, client;

exports.run = (c)=>{
	client = c
	webserv = require('./express')
	webserv.init(client)

	reactionHandler.init(client)
};
