
/* --------- Backing up data ----------*/
create table meetup_statuses_old as select * from meetup_statuses;
create table meetups_old as select * from meetups;
create table logs_old as select * from logs;
create table users_old as select * from users;
create table servers_old as select * from servers;
create table challenges_old as select * from challenges;

/* --------- Dropping tables ----------*/

drop table if exists meetup_statuses;
drop table if exists meetups;
drop table if exists logs;
drop table if exists users;
drop table if exists servers;


/* ---------Table Creation ----------*/
create table servers (
guildID VARCHAR(32) primary key not null,
name TINYTEXT not null,
deleted bit default 0,
config JSON null
);

create table users (
guildID varchar(32) not null,
userID varchar(32) not null,
username nvarchar(255) not null,
points int not null default 0,
location MEDIUMTEXT null,
latitude DECIMAL(15,12),
longitude DECIMAL(15,12),
avatar VARCHAR(255) not null default 'https://discordapp.com/assets/1cbd08c76f8af6dddce02c5138971129.png',
join_date datetime  not null default CURRENT_TIMESTAMP,
FOREIGN KEY (guildID) REFERENCES servers(guildID),
PRIMARY KEY (guildID, userID),
INDEX `userID` (userID)
);

create table logs (
id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
userID varchar(32) not null,
eventType MEDIUMTEXT not null,
description MEDIUMTEXT null,
FOREIGN KEY (userID) REFERENCES users(userID),
INDEX `userID` (userID)
);

create table meetups (
id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
guildID VARCHAR(32) NOT NULL,
ownerID varchar(32) NOT NULL,
channelID varchar(32) NULL,
active bit default 1,
name MEDIUMTEXT NULL,
date varchar(128) NULL,
address MEDIUMTEXT NULL,
description MEDIUMTEXT NULL,
notes MEDIUMTEXT NULL
);

create table meetup_statuses (
id INT NOT NULL,
userID varchar(32) not null,
status varchar(255) not null,
FOREIGN KEY (id) REFERENCES meetups(id)  ON DELETE CASCADE,
PRIMARY KEY (id, userID)
);

create table challenges (
id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
message MEDIUMTEXT NOT NULL,
bin INT NOT NULL DEFAULT 0
);

/* --------- Insert Data ----------*/
INSERT IGNORE INTO servers (guildID, name, deleted, config)
  select guildID, name, deleted, config FROM servers_old;

INSERT IGNORE INTO users (guildID, userID, username, points, location, latitude, longitude, avatar, join_date)
  select guildID, userID, username, points, location, latitude, longitude, avatar, join_date FROM users_old;

INSERT IGNORE INTO logs (id, userID, eventType, description)
  select id, userID, eventType, description FROM logs_old;

INSERT IGNORE INTO meetups (id, guildID, ownerID, channelID, active, name, date, address, description, notes)
  select id, guildID, ownerID, channelID, active, name, date, address, description, notes FROM meetups_old;

INSERT IGNORE INTO meetup_statuses (id, userID, status)
  select id, userID, status FROM meetup_statuses_old;

INSERT IGNORE INTO challenges (id, message, bin)
  select id, message, bin FROM challenges_old;

/* --------- Remove temp tables ----------*/
drop table if exists meetup_statuses_old;
drop table if exists meetups_old;
drop table if exists logs_old;
drop table if exists users_old;
drop table if exists servers_old;
drop table if exists challenges_old;



