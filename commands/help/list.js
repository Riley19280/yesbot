
const dbcmds = require('./../../database');
const util = require('./../../util');
const fs = require("fs");

exports.run = (client, message, args) => {
	let filename;
	if(process.platform == 'win32')
		filename = __filename.split("\\").pop().split(".")[0];
	else
		filename = __filename.split("/").pop().split(".")[0];
		
	let filenames = ["__**Commands:**__"], dirs = [], files;
	
	try {
		files = fs.readdirSync(`./commands/`);
	}
	catch(err){
		message.channel.send('An error has occurred.');
		return;
	}
	files.forEach(file => {
		if(process.env.EXCLUDED_COMMAND_FILES.split('|').includes(file))
			return;
		
		if(file.match(".js$"))
			filenames.push(file.split(".")[0]);
		else 
			dirs.push(file);
	});
	
	try{
		filenames = filenames.filter( function( el ) {
	    return !dirs.includes( el );
	} );
	}catch(err) {console.log(err);}
	
	
	message.channel.send(filenames.concat(dirs).sort());

}