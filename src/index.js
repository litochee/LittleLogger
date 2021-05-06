const Discord = require("discord.js");
const sql = require("sqlite");
const sqlite3 = require("sqlite3");
require("dotenv").config();

// Setup our database
const db = sql.open({
	filename: "./cordLogs.db",
	driver: sqlite3.cached.Database,
});

// Make sure our table is setup
db.then((db) => {
	db.run(
		"CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, channel_id INTEGER NOT NULL, message TEXT NOT NULL, user_id INTEGER NOT NULL, timestamp INTEGER NOT NULL, is_dm INTEGER)"
	);
});

/// END DATABASE SETUP ///

// Login to Discord
const client = new Discord.Client();

client.login(process.env.TOKEN);

client.on("ready", () => {
	console.log("Watching for messages...");
});

// Await messages
client.on("message", (message) => {
	logMessage(message);
});

/// END DISCORD SETUP ///

/**
 * Log a message sent in a channel
 * @param {*} message to log
 */
async function logMessage(message) {
	// If the message is an attachment, let's ignore it.
	// TODO: If the attachment comes with a message, let's store that
	if (message.attachments.size > 0) {
		console.log(
			`Attachment from ${message.author.username} (${message.author.id}) received, ignoring...`
		);
		return;
	}

	// Let's go ahead and log that we received a message from someone
	switch (message.channel.type) {
		case "dm":
			console.log(
				`Message received in DM (${message.channel.id}) from '${message.author.username}' (${message.author.id})`
			);
			break;
		case "text":
			console.log(
				`Message received in channel '#${message.channel.name}' (${message.channel.id}) from '${message.author.username}' (${message.author.id})`
			);
			break;
	}

	// Insert the message into our database
	insertMessage(db, message);
}

/**
 * Insert a message into the sqlite database
 * @param {*} db sqlite database
 * @param {*} message to insert
 */
async function insertMessage(db, message) {
	db.then((db) => {
		db.run(
			"INSERT INTO messages (channel_id, message, user_id, is_dm, timestamp) VALUES (?, ?, ?, ?, ?)",
			[
				message.channel.id,
				message.content,
				message.author.id,
				message.channel.type == "dm" ? 1 : 0, // We don't want to insert a boolean into the INTEGER type, so let's convert it.
				Date.now(),
			]
		).catch((ex) => {
			// If there is some how an error with inserting, let the user know!
			console.log(
				"There was an issue inserting this message into the database!"
			);

			// Let's also log the error generated
			console.log(ex);
		});
	});
}
