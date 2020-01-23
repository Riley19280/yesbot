
const dbcmds = require('./database');

const request = require('request');
const rp = require('request-promise')

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
			'Authorization': 'Bot ' + process.env.DISCORD_LOGIN_TOKEN,
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

exports.locationKML = async (guildId) => {

	let locations = await dbcmds.locationList(guildId)

	let iconLink
	if(process.env.PREFIX !== '!')
		iconLink = 'https://www.dropbox.com/s/j9oht245flp66qg/marker.png?dl=1'
	else
		iconLink = 'https://yestheory.rileystech.com/marker.png'

	// <NetworkLinkControl>
	// <expires>${new Date(new Date().getTime() + 1000 * 60 *5).toISOString()}</expires>
	// </NetworkLinkControl>

	let string = `<?xml version="1.0" encoding="UTF-8"?>
	<kml xmlns="http://www.opengis.net/kml/2.2">
	<Document>
	<name>Yes NC Locations</name>
	<Style id="markerIcon">
		<IconStyle>
			<Icon>
				<href>${iconLink}</href>
			</Icon>
		</IconStyle>
	</Style>`

	for(let loc of locations) {

		string += `
			<Placemark>
				<name>${loc.username}</name>
					<Point>
						<coordinates>${loc.longitude},${loc.latitude},0</coordinates>
					</Point>
					<styleUrl>#markerIcon</styleUrl>
			  </Placemark>`
	}
	string += `</Document></kml>`
	return string

}


exports.geocodeString = async (string) => {

	let geocode_url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(string)}&key=${process.env.MAPS_API_KEY}`

	let results = JSON.parse(await rp(geocode_url))

	if(results.status === 'ZERO_RESULTS')
		return null

	if(results.status === 'OK')
		return results.results[0]

	return null

}