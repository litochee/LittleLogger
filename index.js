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
  //check channel from the message recieved SMART
//console.log(message.channel.name);// finds channel name
let tStamp = moment().format('LLLL');
//console.log(tStamp);
if (message.channel.type == 'dm'){
  let dmName = `${message.author.username}DM`;
  sql.run(`INSERT INTO ${dmName} (username, message, timestamp, userID) VALUES (?,?,?,?)`, [message.author.username, message.content, tStamp, message.author.id]).catch(()=>{
    sql.run(`CREATE TABLE IF NOT EXISTS ${dmName} (username TEXT, message TEXT, timestamp TEXT, userID TEXT);`).then(() =>{
      sql.run(`INSERT INTO ${dmName} (username, message, timestamp, userID) VALUES (?,?,?,?)`, [message.author.username, message.content, tStamp, message.author.id]);
    })
  })
}else{
  sql.run(`INSERT INTO ${message.channel.name} (username, message, timestamp, userID) VALUES (?,?,?,?)`, [message.author.username, message.content, tStamp, message.author.id]).catch(() =>{
    console.error;
    sql.run(`CREATE TABLE IF NOT EXISTS ${message.channel.name} (username TEXT, message TEXT, timestamp TEXT, userID TEXT);`).then(() =>{
      sql.run(`INSERT INTO ${message.channel.name} (username, message, timestamp, userID) VALUES (?,?,?,?)`, [message.author.username, message.content, tStamp, message.author.id]);
    })
  })
}
});
