const Discord = require("discord.js");


const client = new Discord.Client();

const auth = require('./auth.json');
const config = require('./config.json');
const dbcmds = require('./database');
const util = require('./util');
const fs = require("fs");

console.log('Platform: '+ process.platform)

client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
//client.on("debug", (e) => console.info(e));

client.on("ready", async () => {
    await dbcmds.INIT()
    console.log('Connected');
    console.log('Logged in as: ' + client.user.username + ' - (' + client.user.id + ')');
	require('./startup').run(client);
});

client.on("message", message => {
	if (message.author.bot) return;

	//run regardless
	let filename;
	if(process.platform == 'win32')
		filename = __filename.split("\\").pop().split(".")[0];
	else
		filename = __filename.split("/").pop().split(".")[0];

	let valid = [] , files;

	try {
		files = fs.readdirSync(`./commands/`);
	}
	catch(err){
		message.channel.send('An error has occurred.');
		return;
	}
	files.forEach(file => {
		if(config.excluded_command_files.includes(file))
			return;
		valid.push(file.split(".")[0]);
	});

    //not command
	if(message.content.indexOf(config.prefix) !== 0) {
		if (message.channel.type !== "dm") {

		}
		return;
	}

	//disallow commands in dms
	if(message.content.indexOf(config.prefix) === 0 && message.channel.type === "dm") {
		message.channel.send('Commands are not available in DM\'s.');
		return;
	}


  // This is the best way to define args. Trust me.
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  let command = args.shift().toLowerCase();

  //make sure it is a valid command
  	if(!valid.includes(command) && !Object.keys(config.aliases).includes(command))
	{
		message.channel.send('Unrecognized Command!');
		return;
	}

    try {
  	    if(Object.keys(config.aliases).includes(command))
  	        command = config.aliases[command]
        let commandFile = require(`./commands/${command}.js`);
        commandFile.run(client, message, args);
    } catch (err) {
        console.error(err);
        message.channel.send('Error executing command.');
    }
});

//const mysvr = require("./mywebserver");
//mysvr.run(client);

// This loop reads the /events/ folder and attaches each event file to the appropriate event.
fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    let eventFunction = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    // super-secret recipe to call events with all their proper arguments *after* the `client` var.
    client.on(eventName, (...args) => eventFunction.run(client, ...args));
  });
});


client.login(auth.token);