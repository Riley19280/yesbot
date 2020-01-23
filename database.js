
module.exports = {
	confirmPresence:confirmPresence,
	setLocation: setLocation,
	getLocation: getLocation,
	locationList: locationList,
	createMeetup: createMeetup,
	setMeetupChannel:setMeetupChannel,
	deleteMeetup:deleteMeetup,
	getAllMeetups:getAllMeetups,
	editMeetupAttribute:editMeetupAttribute,
	setMeetupStatus:setMeetupStatus,
	getMeetupStatus:getMeetupStatus,
	getAllChallenges:getAllChallenges,
	addChallenge:addChallenge,
	deleteChallenge:deleteChallenge,
	getChallenge:getChallenge
};

const sanitizer = require('sanitizer');

const mysql = require('promise-mysql');




 let conn;
 const dbconfig = {
	 user: process.env.DB_USER,
	 password: process.env.DB_PASSWORD,
	 host: process.env.DB_HOST,
	 database: process.env.DB_DATABASE
 };


module.exports.INIT = async function () {
	if (conn == null)
		return await mysql.createConnection(dbconfig).then(function(con){
			conn = con;
		})
	else {
        // console.log("Database connection already initialized.")
    }
}


module.exports.close = function () {
	return new Promise((res,reject) => {
		conn.end()
		res()
	})
}

 async function confirmPresence(member) {
     await module.exports.INIT()
	 return conn.query(
		 "insert into users(guildID,userID,username,avatar) values(?,?,?,?) ON DUPLICATE KEY UPDATE guildID = ?, userID = ?, username = ?, avatar = ?",
		 [
			 member.guild.id, member.id, member.displayName, member.user.displayAvatarURL,//insert statement
			 member.guild.id, member.id, member.displayName, member.user.displayAvatarURL//update statement
		 ]
	 ).catch((err) => {
		 // console.log(err)
	 })
 }
 
 async function setLocation(member, address, lat, lng){
	return new Promise(async (resolve, reject) => {
		try {
			await genericSet("location", member, address);
			await genericSet("latitude", member, lat);
			await genericSet("longitude", member, lng);
			resolve()
		}	catch (e) {
			reject(e)
		}
	})
 }

 function getLocation(member){
	 return genericGet("location", member);
 }

 async function genericSet(colname,member,val){
	 await confirmPresence(member)

	 return conn.query('update users set '+colname+' = ? where guildID = ? and userID = ?',
		 [ val, member.guild.id, member.id ])
	 .catch((err) => {
	 	console.error('generic set failed: '+ colname)
		console.error(err)
		return Promise.reject(false)
	 })
 }
 
 async function genericGet(colname, member){
	await confirmPresence(member)

	return conn.query('select * from users where guildID = ? and userID = ?',
		[ member.guild.id, member.id ])
	.then((rows) => {
		if (rows[0] == null)
			return Promise.resolve(null);
		return Promise.resolve(rows[0][colname])
		})
	.catch((err) => {
		console.error('generic get failed, ' + member.user.username)
		console.error(err)
		return Promise.reject()
	})
 }

 async function locationList(guildId) {
	 return conn.query('select username, latitude, longitude from users where guildID = ? and latitude is not null and longitude is not null',
		 [ guildId ])
		 .then((rows) => {
			 if (rows[0] == null)
				 return Promise.resolve([]);
			 return Promise.resolve(rows)
		 })
		 .catch((err) => {
			 console.error(err)
			 return Promise.reject()
		 })
 }
 
 async function createMeetup(member, params) {
	 await confirmPresence(member)

	 return conn.query('INSERT INTO meetups (guildID, ownerID, name, date, address, description, notes) VALUES (?,?,?,?,?,?,?)',
		 [ member.guild.id, member.id, params.name, params.date, params.address, params.description, params.notes])
		 .then((data) => {
		 	return data.insertId
		 })
		 .catch((err) => {
			 console.error('create meetup failed: '+ JSON.stringify(params))
			 console.error(err)
			 return Promise.reject(false)
		 })
 }

 async function setMeetupChannel(meetupID, channelID) {
	 return conn.query('UPDATE meetups set channelID = ? where id = ?',
		 [ channelID, meetupID ])
		 .catch((err) => {
			 console.error('set meetup channel id failed')
			 console.error(err)
			 return Promise.reject(false)
		 })
 }

 async function deleteMeetup(meetupID) {
	 return conn.query('DELETE from meetups where id = ?',
		 [ meetupID ])
		 .catch((err) => {
			 console.error('delete meetup failed')
			 console.error(err)
			 return Promise.reject(false)
		 })
 }

 async function editMeetupAttribute(meetupID, attribute, value) {
	 return conn.query(`UPDATE meetups set ${attribute} = ? where id = ?`,
		 [ value, meetupID ])
		 .catch((err) => {
			 console.error(`update meetup (${meetupID}) attribute failed, ${attribute} => ${value}`)
			 console.error(err)
			 return Promise.reject(false)
		 })
 }

 async function getAllMeetups(guild) {
	 return conn.query('select * from meetups where guildID = ?',
		 [ guild.id ])
		 .then((rows) => {
			 if (rows[0] == null)
				 return Promise.resolve([]);
			 return Promise.resolve(rows)
		 })
		 .catch((err) => {
			 console.error(err)
			 return Promise.reject()
		 })
 }

 async function setMeetupStatus(meetupID, member, status) {
	 return conn.query(`INSERT INTO meetup_statuses(id, userID, status) values(?,?,?) ON DUPLICATE KEY UPDATE status = ?`,
		 [ meetupID, member.id, status, status ])
		 .catch((err) => {
			 console.error(`update meetup (${meetupID}) attribute failed, ${attribute} => ${value}`)
			 console.error(err)
			 return Promise.reject(false)
		 })
 }

 async function getMeetupStatus(meetupID, member, fetchAll=false) {
	let query = 'select u.username, ms.* from meetup_statuses ms join users u on u.userID = ms.userID and u.guildID = ? where id = ? '
	if(!fetchAll)
	 	query = `select u.username, ms.* from meetup_statuses ms join users u on u.userID = ms.userID and u.guildID = ? where id = ? and u.userID = ${member.id}`
	return conn.query(query,
		 [ member.guild.id, meetupID ])
		 .then((rows) => {
			 if (rows[0] == null)
				 return Promise.resolve([]);
			 return Promise.resolve(rows)
		 })
		 .catch((err) => {
			 console.error(err)
			 return Promise.reject()
		 })
 }

 async function addChallenge(message) {
	 return conn.query(`INSERT INTO challenges (message) VALUES (?)`,
		 [ message ])
		 .then((data) => {
			 return data.insertId
		 })
		 .catch((err) => {
			 console.error(err)
			 return Promise.reject()
		 })
 }

 async function getAllChallenges() {
	 return conn.query('select * from challenges ',
		 [ ])
		 .then((rows) => {
			 if (rows[0] == null)
				 return Promise.resolve([]);
			 return Promise.resolve(rows)
		 })
		 .catch((err) => {
			 console.error(err)
			 return Promise.reject()
		 })
 }

 async function deleteChallenge(id) {
	 return conn.query('DELETE FROM challenges where id = ?',
		 [ id ])
		 .catch((err) => {
			 console.error(err)
			 return Promise.reject()
		 })
 }

 async function getChallenge() {
	 let challenges = await getAllChallenges()
	 if(challenges.length === 0) return 'No challenges in database.'
	 let min_bin = Math.min(...challenges.map(c => c.bin))
	 // let max_bin = Math.max(...challenges.map(c => c.bin))
	 challenges = challenges.filter(x => x.bin === min_bin)
	 let challenge  = challenges[Math.floor(Math.random() * challenges.length)]

	 await conn.query('UPDATE challenges SET bin = bin + 1 where id = ?',
		 [ challenge.id ])
		 .catch((err) => {
		 	 console.log('get challenge error')
			 console.error(err)
			 return Promise.reject()
		 })

	 return challenge
 }