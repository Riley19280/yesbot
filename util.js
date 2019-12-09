const config = require('./config.json');
const dbcmds = require('./database');
const auth = require('./auth.json');
const request = require('request');

exports.formatArr = (arr) => {
	let str = "";
	for(let i=0; i < arr.length; i++){
		str += arr[i];
		if(i != arr.length-1)
			str +=", ";
	}
	if(str == "")
		return str;
	
	return "*"+str+"*";
};

exports.setChannelParent = (channelid,parent_id) => {
	var options = {
		url: 'https://discordapp.com/api/v6/channels/'+channelid,
		headers: {
			'Authorization': 'Bot ' + auth.token,
			'content-type': 'application/json'
		},
		method: 'PATCH',
		body: '{"parent_id":"382612346553499649"}'
	};

	function callback(error, response, body) {
		if(error)
			console.log(error)
	}

	request(options, callback);
}

function pluralize(val, str) {
    return val == 1 ? str : str + 's'
}

exports.minutesToTimespan = (mins) => {
    mins = Math.abs(mins)
    let days = Math.floor(mins / 1440)
    let hours = Math.floor((mins - (days * 1440)) / 60)
    let minutes = Math.floor((mins - (days * 1440) - (hours * 60)))

    let strs = []
    if(days > 0)
        strs.push(`${days} ${pluralize(days, 'day')}`)
    if(hours > 0)
        strs.push(`${hours} ${pluralize(hours, 'hour')}`)
    if(minutes > 0)
        strs.push(`${minutes} ${pluralize(minutes, 'minute')}`)

    return strs.join(', ')
}
