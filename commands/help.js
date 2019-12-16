const config = require('./../config.json');
const dbcmds = require('./../database');
const util = require('./../util');
const fs = require("fs");

exports.desc = "Help with commands.";

let filename;
if(process.platform == 'win32')
	filename = __filename.split("\\").pop().split(".")[0];
else
	filename = __filename.split("/").pop().split(".")[0];

let valid = [],allcmds = [], files;
//getting valid files to run for help
try {
	files = fs.readdirSync(`./commands/${filename}/`);
}
catch(err){
	console.log(err);
	return message.channel.send('An error has occurred.');
}
files.forEach(file => {
	if(config.excluded_command_files.includes(file))
		return;
	valid.push(file.split(".")[0]);
});

exports.params = ["command","list"];

exports.run = (client, message, args) => {
	//getting valid files to run for all commands
	try {
		files = fs.readdirSync(`./commands/`);
	}
	catch(err){
		console.log(err);
		message.channel.send('An error has occurred.');
		return;
	}
	files.forEach(file => {
		if(config.excluded_command_files.includes(file))
			return;
		allcmds.push(file.split(".")[0]);
	});
	
	if(!valid.includes(args[0]))
	{//is not a subcommand of help
		
		if(args[0] == null){
			message.channel.send(`__**Usage:**__ ${config.prefix}help <*command, list*> \nParameters in <> are mandatory, parameters in () are optional.`);
			return;
		}
		
		if(!allcmds.includes(args[0]))
		{//is not in all cmds
			message.channel.send('Help command not found.');
			return;
		}
		//command
		let commandFile = require(`./${args[0]}.js`);
		
		//param of command was supplied
		if(commandFile.params.includes(args[1])){
			let subcmdFile = require(`./${args[0]}/${args[1]}.js`);
			let params = util.formatArr(subcmdFile.params);
			if(params != "") params = '<'+params+'>';
			let usage = `__**Usage:**__ ${config.prefix}${args[0]} ${args[1]} ${params} ${subcmdFile.optionalParam || ""}`;
			message.channel.send(usage);
		}
		
		//no param of command was supplied
		else{
			let params = util.formatArr(commandFile.params);
			if(params != "") params = '<'+params+'>';
			let usage = `__**Usage:**__ ${config.prefix}${args[0]} ${params} ${commandFile.optionalParam || ""}`;
			message.channel.send(usage);
		}
		
	}
	else { //is a subcommand of help
		try {
			let commandFile = require(`./${filename}/${args[0]}.js`);
			commandFile.run(client, message, args);
		} catch (err) {
			message.channel.send('Invalid parameter. Must be <'+util.formatArr(valid)+'>');
			return;
		}
	}
}









