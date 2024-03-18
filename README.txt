Collaborators: Ash, Connie, Morgan

This project consists of three web servers: normal_server, honeypot_server, and captcha_server. The normal_server has the least levels of defense and the captcha_server the most.

We have included only one spambot. We were going to have two: one that is naive and incapable of bypassing a honeypot, and another that is more advanced and capable of bypassing a honeypot. What we discovered is that the api we were using bypassed the honeypot for us. Effectively then you can see that the honeypot server is just as vulnerable as the normal server.

We recommend running these two processes (server and spam) in two separate terminal tabs. You must start a server befor running a spam bot, or the spam bot will have nothing to attack. Here are the commands to run each program:

node normal_server/server.js
node honeypot_server/server.js
node captcha_server/server.js

node spam_bot/spam.js

Log files are writen to the operating servers data folder, i.e. normal_server/data/...
All logs are dated with an epoch timestamp.
