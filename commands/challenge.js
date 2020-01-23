
const dbcmds = require('./../database');
const util = require('./../util');
const fs = require('fs-extra')

exports.desc = "Create, manage and organize meetups!";
let filename;
if(process.platform == 'win32')
    filename = __filename.split("\\").pop().split(".")[0];
else
    filename = __filename.split("/").pop().split(".")[0];
let valid = [] , files;

try {
    files = fs.readdirSync(`./commands/${filename}/`);
}
catch(err){
    console.log(err);
    return;
}
files.forEach(file => {
    if(process.env.EXCLUDED_COMMAND_FILES.split('|').includes(file))
        return;
    valid.push(file.split(".")[0]);
});

exports.params = valid;

// exports.optionalParam = "";


exports.run = (client, message, args) => {

    if(!valid.includes(args[0]))
    {
        message.channel.send('Invalid parameter. Must be <'+util.formatArr(valid)+'>');
        return;
    }

    try {
        delete require.cache[require.resolve(`./${filename}/${args[0]}.js`)];
        let commandFile = require(`./${filename}/${args[0]}.js`);
        commandFile.run(client, message, args);
    } catch (err) {
        console.error(err)
        message.channel.send('Invalid parameter. Must be <'+util.formatArr(valid)+'>');
        return;
    }

}