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
  await say(`Hey there <@${message.user}>! 👋 How can I help you today?`);
});

// Reply when someone says "hello"
app.message('hello', async ({ message, say }) => {
  await say(`Hello <@${message.user}>! 👋 How can I help you today?`);
});


 // Reply when someone asks what the bot is
app.message(
  /^(what is this|who are you|who r u|ru a bot|are you a bot|r u a bot|what are you|who ru)[?!.,\s]*$/i,
  async ({ message, say }) => {
    await say(
      `Hi <@${message.user}>! 👋 I'm jy junior, a Slack bot here to help you! 🤖 Jing yew might be busy right now, so I will be handling your enquiries if any! Type /jy-junior-help to see what I can do for you. `
    );
  }
);

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
/jy-junior-joke - Get a random joke
/jy-junior-8ball - Ask the magic 8-ball a question
/jy-junior-roll - Roll a dice (optionally give it a number of sides)
/jy-junior-advice - Get a random piece of advice
/jy-junior-apod - NASA Astronomy Picture of the Day
/jy-junior-quote - Get a random inspirational quote`
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

// Slash command: /jy-junior-8ball — magic 8-ball, picks a random answer
app.command('/jy-junior-8ball',async ({ ack, respond, command }) => {
  await ack();
  const answers = [
    "It is certain.",
    "It is decidedly so.",
    "Without a doubt.",
    "Yes - definitely.",
    "You may rely on it.",
    "As I see it, yes.",
    "Most likely.",
    "Outlook good.",
    "Yes.",
    "Signs point to yes.",
    "Reply hazy, try again.",
    "Ask again later.",
    "Better not tell you now.",
    "Cannot predict now.",
    "Concentrate and ask again.",
    "Don't count on it.",
    "My reply is no.",
    "My sources say no.",
    "Outlook not so good.",
    "Very doubtful."
  ];

  //Pick a random answer from the list
  const answer = answers[Math.floor(Math.random() * answers.length)];
  const question = command.text;
  if (question) {
    await respond(` 🎱 You asked: "${question}"\nAnswer: ${answer}`);
  } else {
    await respond(' 🎱 Please ask a question after the command, e.g., /jy-junior-8ball Will I get a raise?');
  }
});

// Slash command: /jy-junior-roll — rolls a dice (default 6 sides)
app.command('/jy-junior-roll', async ({command, ack, respond}) => {
  await ack();

  // Use the number the user typed, or default to 6 sides
  let sides = parseInt(command.text);
  if (isNaN(sides) || sides < 1) {
    sides = 6;
  }

  const result = Math.floor(Math.random() * sides) + 1;
  await respond(`🎲 You rolled a ${result} (1-${sides})`)
});

// Slash command: /jy-junior-advice — fetches a random piece of advice from an API
app.command('/jy-junior-advice', async ({ ack, respond }) => {
  await ack();
  try {
    const response = await axios.get('https://api.adviceslip.com/advice');
    await respond({ text: `💡 Advice:\n${response.data.slip.advice}` });
  } catch (err) {
    await respond({ text: 'Failed to fetch advice.' });
  }
});

// Slash command: /jy-junior-apod — NASA Astronomy Picture of the Day
app.command('/jy-junior-apod', async ({ ack, respond }) => {
  await ack();
  try {
    const apiKey = process.env.NASA_API_KEY;
    const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`);
    const data = response.data; 
    console.log('APOD DATA:',data.media_type, '|', data.url);
    
    // NASA sometimes returns a fallback image (its own logo) when the real image is unavaliable.
    const isFallback = !data.url || data.url.includes('nasa-logo') || data.title === 'NASA Science';
    if (isFallback) {
      await respond({ text: "NASA's piccture of the day isn't available right now.(Their API returned a placeholder) Try again later! 🛰️" });
      return;
    }
    
    if (data.media_type === 'image') {
      await respond({
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*NASA Astronomy Picture of the Day*\n*${data.title}* (${data.date})`,
            },
          },
          {
            type: 'image',
            image_url: data.url,
            alt_text: data.title,
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: data.explanation.slice(0, 2900),
            },
          },
        ],
      });
    } else {
      await respond({
        text: `NASA Astronomy Picture of the Day\n*${data.title}* (${data.date})\n${data.url}\n\n${data.explanation.slice(0, 2900)}`,
      });
    }
      } catch (err) {
    console.log('APOD ERROR:', err.response ? err.response.data : err.message);
    await respond({ text: "Couldn't reach NASA right now — their API may be having a moment. Try again in a bit! 🛰️" });
  }
});

// Slash command: jy-junior-quote — fetches a random inspirational quote
app.command('jy-junior-quote', async ({ack, respond}) => {
  await ack();
try {
    const response = await axios.get('https://dummyjson.com/quotes/random');
  const quote = response.data[0];
  await respond({ text: `💬 "${quote.q}"\n— *${quote.a}*` });
} catch (err) {
    console.log('QUOTE ERROR:', err.response ? err.response.data : err.message);
    await respond({ text: "Couldn't fetch a quote right now. Try again in a bit!"});
  }
});

(async () => {
  await app.start();
  console.log('⚡️ jy junior is running!');
})();
