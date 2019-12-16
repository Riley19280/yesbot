
 module.exports = {
  
 	 confirmPresence:confirmPresence,
	 setLocation: setLocation,
	getLocation: getLocation,
	locationList: locationList

};

const sanitizer = require('sanitizer');

const mysql = require('promise-mysql');
const auth = require('./auth.json');
 const config = require('./config.json');


 let conn;
 const dbconfig = {
	 user: auth.database.user,
	 password: auth.database.password,
	 host: auth.database.host,
	 database: auth.database.database
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