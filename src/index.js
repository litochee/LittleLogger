const Discord = require("discord.js");
const client = new Discord.Client();
const sql = require("sqlite");
const sqlite3 = require("sqlite3");
require("dotenv").config();

(async () => {
	// Login to Discord
	client.login(process.env.TOKEN);

	const db = sql
		.open({
			filename: "./cordLogs.db",
			driver: sqlite3.cached.Database,
		})
		.then((db) => {
			// First, we will use the channel id just incase two channels happen to have the same name, it's bad to use names as ids anyway.
			// Secondly, We're going to store time in the form of a unix timestamp (seconds since 1970-01-01 00:00:00 UTC) as it's the easiest to work with
			// Lastly, we're going to put this all in one table, there's no need to make a separate table for DMs when we can just have a boolean (sqlite doesn't have booleans, so we use 0 and 1)

			// Let's setup our table here so we don't have to do checks for it later.
			db.run(
				"CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, channel_id INTEGER NOT NULL, message TEXT NOT NULL, user_id INTEGER NOT NULL, timestamp INTEGER NOT NULL, is_dm INTEGER)"
			);

			client.on("ready", () => {
				console.log("Watching for messages...");
			});

			client.on("message", (message) => {
				// Let's go ahead and log that we received a message from someone
				if (message.channel.type == "dm") {
					console.log(
						`Message received in DM (${message.channel.id}) from '${message.author.username}' (${message.author.id})`
					);
				} else {
					console.log(
						`Message received in channel '#${message.channel.name}' (${message.channel.id}) from '${message.author.username}' (${message.author.id})`
					);
				}

				// Insert the message into our database
				db.run(
					"INSERT INTO messages (channel_id, message, user_id, is_dm, timestamp) VALUES (?, ?, ?, ?, ?)",
					[
						message.channel.id,
						message.content,
						message.author.id,
						message.channel.type == "dm" ? 1 : 0, // We don't want to insert a boolean into the INTEGER row, so let's convert it.
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
		});
})();
