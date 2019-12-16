/* --------- Remove temp tables ----------*/
drop table if exists logs_old;
drop table if exists users_old;
drop table if exists servers_old;



/* --------- Backing up data ----------*/
create table logs_old as select * from logs;
create table users_old as select * from users;
create table servers_old as select * from servers;

/* --------- Dropping tables ----------*/

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
)