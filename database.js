
 module.exports = {
  
 	 confirmPresence:confirmPresence,
  	 setBattletag: setBattletag,
 	 setSteam: setSteam,
	 setSteamId: setSteamId,
 	 getBattletag: getbattletag,
 	 getSteam: getSteam,
	 getSteamId: getSteamId,


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
	return
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
	//console.log(member)
	 return conn.query(
		 "insert into users(guildID,userID,username,avatar) values(?,?,?,?) ON DUPLICATE KEY UPDATE guildID = ?, userID = ?, username = ?, avatar = ?",
		 [
			 member.guild.id, member.id, member.user.username, member.user.displayAvatarURL,//insert statement
			 member.guild.id, member.id, member.user.username, member.user.displayAvatarURL//update statement
		 ]
	 ).catch((err) => {
		 console.log(err)
	 })
 }

 function setBattletag(member, tag){
	 return genericSet("battletag",member,tag)
	 .then(()=>{
	 	return genericSet("ow_sr",member,null);
	 })
	 .then(()=>{exports.addNewBattletag(tag)})
 }
 
 function setSteam(member, tag){
	return genericSet("steam",member,tag);
 }

 function getSteam(member){
	 return genericGet("steam",member);
 }

 function setSteamId(member, tag){
     return genericSet("steam_id",member,tag);
 }

 function getSteamId(member){
     return genericGet("steam_id",member);
 }
 
 function getbattletag(member){
	 return genericGet("battletag",member);

 }

 function getTwitch(member){
     return  genericGet("twitch",member);
 }

 function setTwitch(member,username,id){
     return	 genericSet("twitch_id",member,id).then(()=>{
     	return genericSet("twitch",member,username);
	 });

 }

 function genericSet(colname,member,val){
	 return confirmPresence(member)
	 .then(() => {
		 return conn.query('update users set '+colname+' = ? where guildID = ? and userID = ?',
			 [ val, member.guild.id, member.id ])
	 })
	 .catch((err) => {
	 	console.log('generic set failed: '+ colname + "\n" + err)
		 return Promise.reject(false)
	 })
 }
 
 function genericGet(colname,member){
	return confirmPresence(member).then(() => {
		return conn.query('select * from users where guildID = ? and userID = ?',
			[ member.guild.id, member.id ])
		})
	.then((rows) => {
		if (rows[0] == null)
			return Promise.resolve(null);
		return Promise.resolve(rows[0][colname])
		})
	.catch((err) => {
		console.log(err)
		return Promise.reject()
	})
 }

 function randomString(num) {
	 let text = "";
	 let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	 for (let i = 0; i < num; i++)
		 text += possible.charAt(Math.floor(Math.random() * possible.length));

	 return text;
 }

 
 
 