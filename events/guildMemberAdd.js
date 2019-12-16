const config = require('./../config.json');
const dbcmds = require('./../database');

exports.run = (client,member) => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.find('name', 'introduction');
  // Do nothing if the channel wasn't found on this server
  if (!channel) { console.log("unable to find channel welcome we welcome users."); return;}
  // Send the message, mentioning the member
  //channel.send(`Welcome to ${member.guild.name}, ${member.username}`);

  member.createDM().then((channel)=>{channel.send(`Welcome to the Yes Charlotte community ${member.user.username}!! \nPlease make sure to check out the rules page and read the channel descriptions. \nHave fun!`);});

  channel.send(`Welcome to the Yes Charlotte community <@${member.user.id}>!! Feel free to introduce yourself so we can get to know you!`)

  // member.addRole(member.guild.roles.find("name", config.default_role))
  //   .catch(()=>{
	// 	let log = member.guild.channels.find('name', 'message_board')
  // 		if(log){
  // 			log.send(`Bot was unable to set default role "${config.default_role}" on ${member.username}`)
	// 		console.log(`Bot was unable to set default role "${config.default_role}" on ${member.username}`)
	// 	}
	// })

};