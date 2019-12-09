const config = require('./config.json');
const util = require('./util');
const { spawn } = require('child_process')


let webserv, client;

exports.run = (c)=>{
	client = c
};
