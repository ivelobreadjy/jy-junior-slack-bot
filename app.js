require('dotenv').config();
const { App } = require('@slack/bolt');
const axios = require('axios');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

// Reply when someone says "hi"
app.message('hi', async ({ message, say }) => {
  await say(`Hey there <@${message.user}>! 👋`);
});

// Slash command: /jy-junior-ping — replies with latency
app.command('/jy-junior-ping', async ({ ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond(`🏓 Pong! Latency: ${latency}ms`);
});

// Slash command: /jy-junior-help — lists commands
app.command('/jy-junior-help', async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/jy-junior-ping - Check bot latency
/jy-junior-catfact - Get a cat fact
/jy-junior-joke - Get a random joke`
  });
});

// Slash command: /jy-junior-catfact — fetches a cat fact from an API
app.command('/jy-junior-catfact', async ({ ack, respond }) => {
  await ack();
  try {
    const response = await axios.get('https://catfact.ninja/fact');
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: 'Failed to fetch a cat fact.' });
  }
});

// Slash command: /jy-junior-joke — fetches a random joke from an API
app.command('/jy-junior-joke', async ({ ack, respond }) => {
  await ack();
  try {
    const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
    await respond({
      text:
`${response.data.setup}

${response.data.punchline}`
    });
  } catch (err) {
    await respond({ text: 'Failed to fetch a joke.' });
  }
});

(async () => {
  await app.start();
  console.log('⚡️ jy junior is running!');
})();


