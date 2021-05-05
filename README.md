# **Warning**

Discord self-bots will get your account **permanently** suspended! I do not condone using them and this is just an educational project.

# LittleLogger

This discord bot made in Discord JS will copy any messages and log them into sqlite db.

# Database schema

## Table schema

|       Name       |  Type   | Nullable |                                  Description                                  |
| :--------------: | :-----: | :------: | :---------------------------------------------------------------------------: |
| id (Primary key) | INTEGER |  false   |                               Primary table key                               |
|    channel_id    | INTEGER |  false   |                 Id for the channel a message was received in                  |
|     message      |  TEXT   |  false   |                             The message received                              |
|     user_id      | INTEGER |  false   |                   The id of the user that sent the message                    |
|    timestamp     | INTEGER |  false   |                       The time the message was received                       |
|      is_dm       | INTEGER |  false   | If the channel the message was sent in is a DM<br>(`1` if true, `0` if false) |

# Installing

1. Open config.json and update with your token code
2. run on node:
    > npm install --save discord.js  
    > npm install --save sqlite  
    > npm install --save moment

3.Open node command prompt and type "node index.js" to start and it will start logging!
