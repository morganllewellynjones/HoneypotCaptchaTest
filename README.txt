Collaborators: Ash, Connie, Morgan

This project consists of three web servers: normal_server, honeypot_server, and captcha_server.
The normal_server has the least levels of defense and the captcha_server the most.

We also have included two spambots: naive_spambot and advanced_spambot.

We recommend running these two processes (server and spam_bot) in two separate terminal tabs.
You must start a server before running a spam_bot, or the spam_bot will have nothing to attack.
Here are the commands to run each program:

To run an instance of a Victim Server
node normal_server/server.js
node honeypot_server/server.js
node captcha_server/server.js

To run an instance of a Spam Bot
node spam_bot/naive_spam.js
node spam_bot/advanced_spam.js
