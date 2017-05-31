const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const moment = require('moment');
const sql = require('sqlite');

sql.open('./cordLogs.sqlite');

client.login(config.token);

client.on('ready', () =>{
  console.log('Logging');
})

client.on('message', message =>{
  //check channel from the message recieved
let tStamp = moment().format('LLLL'); //creates time stamp

if (message.channel.type == 'dm'){ //checks for DM - Creates a DM DB and records
  let dmName = `${message.author.username}DM`;
  sql.run(`INSERT INTO ${dmName} (username, message, timestamp, userID) VALUES (?,?,?,?)`, [message.author.username, message.content, tStamp, message.author.id]).catch(()=>{
    sql.run(`CREATE TABLE IF NOT EXISTS ${dmName} (username TEXT, message TEXT, timestamp TEXT, userID TEXT);`).then(() =>{
      sql.run(`INSERT INTO ${dmName} (username, message, timestamp, userID) VALUES (?,?,?,?)`, [message.author.username, message.content, tStamp, message.author.id]);
    })
  })
}else{ //otherwise it's a normal channel
  sql.run(`INSERT INTO ${message.channel.name} (username, message, timestamp, userID) VALUES (?,?,?,?)`, [message.author.username, message.content, tStamp, message.author.id]).catch(() =>{
    console.error;
    sql.run(`CREATE TABLE IF NOT EXISTS ${message.channel.name} (username TEXT, message TEXT, timestamp TEXT, userID TEXT);`).then(() =>{
      sql.run(`INSERT INTO ${message.channel.name} (username, message, timestamp, userID) VALUES (?,?,?,?)`, [message.author.username, message.content, tStamp, message.author.id]);
    }) // KNOWN ISSUE: Does not like channels with "-" in them
  })
}
});
