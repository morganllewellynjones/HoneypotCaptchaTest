## Honeypot Captcha Test

### About the Study
This test was created in the last week of Computer and Network Security I, as a project to determine if Honeypot Captcha's could be considered a reasonable defense against spambots in todays Internet. 

To test our theory, we elected to create three similar but slightly different Node.js servers, each serving a simplistic blog.
The normal_server, has no defenses of any kind.
The honeypot_server, has a honeypot captcha field to ensnare bots.
The captcha_server, has a riddle challenge captcha to ward off bots.

In theory, a simplistic spambot that made no attempt to account for the possibility of a honeypot field would be ensared by our honeypot_server (and blocked out). In reality, the Puppeteer API we used to implement our spam bot implicitly dodges hidden fields, and therefore circumvented the honeypot CAPTCHA entirely, without any additional labour required from the would-be-spammer.

The captcha_server with a riddle CAPTCHA does shield against the spam bot however, we don't seriously recommend traditional CAPTCHAs as an adequate defense against spam, in part due to accessibility concerns and user frustration.

### Code Overview
Each server is implemented in Node.js, and is designed to serve a simple login page and blog page over localhost. Each server stores login credentials in its filesystem, and a set of blog posts. If they meet with a suspicious request they simply return a 200 status to avoid arousing suspicion from a potential spam bot.

Testing the normal_server and honeypot_server should behave identically, given that Puppeteer circumvents the honeypot.

A single spam bot is included, it uses Puppeteer to attempt to stuff login credentials, get into the blog and post spam.

### Running this Test
The following are required to run this test:

Chrome (for Puppeteer)
Node.js

Two test open two terminal tabs, run the server first, and then run the spambot in a second tab.
i.e. 

\# Start a server in the first terminal window
1> `(cd normal_server && npm install && node server.js)`

\# Start the spambot in a second terminal window
2> `(cd spam_bot && npm install && node spam.js)`

...and watch the output in your terminal.

You can also search for localhost:8080/ in your browser after you have started a server to interact with the pages manually.

Note these instructions are written and tested on Debian, if you are using a Windows computer your shell commands may differ.

In addition to piping to stdout the servers also track successful and failed login attempts in {server_dir}/data/login_log.csv and {server_dir}/data/wrong_login_log.csv (respectively). They also track ips from suspicious login attempts in {server_dir}/data/spam_log.csv, although they do not bar them at present.
