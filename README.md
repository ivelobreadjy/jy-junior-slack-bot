jyjunior - my slack bot
a slack bot built with node.js and the Slack bot framework, replying to messages and responds to slash commands. built and hosted 24/7 on nest.
features are: 
1. replies when a user says hi or hello to my bot. (i also have added an additional line of code so that the bot can reply to other messages such as 'who are you' or 'what is this' or 'are you a bot', etc.)
2. /jy-junior-ping, checks the bots latency and replies with the round trip time
3. /jy-junior-help, lists all available commands
4. /jy-junior-catfact — fetches a random cat fact from an API
5. /jy-junior-joke — fetches a random joke from an API
6. /jy-junior-advice - gives random advice from an API
7. /jy-junior 8ball- magic 8-ball, picks a random answer
8. /jy-junior roll - rolls a dice (default 6 sides, but user can choose however many sides he/she likes)

Built with Node.js
@slack/bolt — Slack app framework
dotenv — loads secret tokens from a .env file
axios — makes requests to external APIs
Socket Mode — so the bot connects to Slack without needing a public web server

To run it locally,
clone this repo:
   git clone https://github.com/ivelobreadjy/jy-junior-slack-bot.git
   cd jy-junior-slack-bot
   
install the dependencies:

   npm install
create a .env file in the project folder with your Slack tokens:

   SLACK_BOT_TOKEN=xoxb-your-bot-token
   
   SLACK_APP_TOKEN=xapp-your-app-level-token
   
   SLACK_SIGNING_SECRET=your-signing-secret
   
start the bot:
   node app.js
when it's running you'll see ⚡️ jy junior is running! in the terminal. 

Hosting

the bot runs 24/7 on nest as a systemd service, so it stays online after disconnecting and restarts automatically if it crashes or the server reboots.

Notes

The .env file holds secret tokens and is kept out of the repository with .gitignore, so no credentials will be shown.
