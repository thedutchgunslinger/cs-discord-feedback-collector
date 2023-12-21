
const { Client, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");
const {fs } = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const logActiveThreads = async () => {
  const guilds = client.guilds.cache;
  for (const guild of guilds.values()) {
    const channels = await guild.channels.fetch();
    for (const channel of channels.values()) {
      if (
        channel.type === "GUILD_PUBLIC_THREAD" &&
        channel.archived === false
      ) {
        console.log(`Active thread: ${channel.name} in guild: ${guild.name}`);
      }
    }
  }
};

client.on("messageCreate", async (message) => {
  console.log("yee");
  let messagesArray = [];
  if (message.content === "!logMessages") {
    const channel = message.channel;
    try {
     
      const messages = await channel.messages.fetch({ limit: 100 });
        if (messages.size == 100) {
          message.channel.send("error, to many messages in this thread! 😢");
        } else {
        
            
      console.log(`Received ${messages.size} messages`);
      messages.forEach((msg) =>
        // console.log(`[${msg.createdAt}] ${msg.author.tag}: ${msg.content}`)
        messagesArray.push({
          send: msg.createdAt,
          author: msg.author.tag,
          content: msg.content,
        })
      );
    }
    } catch (err) {
      console.error(err);
    }
      console.log("creator", messagesArray[messagesArray.length - 1]);

  }
//   console.log(messagesArray);
  // create a new set of authors
  // if author is in set, add to count
  // else add author to set and set count to 1

  const authors = new Set();
    const authorCount = new Map();

    messagesArray.forEach((msg) => {
      if (authors.has(msg.author)) {
        authorCount.set(msg.author, authorCount.get(msg.author) + 1);
      } else {
        authors.add(msg.author);
        authorCount.set(msg.author, 1);
      }
    });


    // make the map a nice object
    const authorCountObj = {};
    authorCount.forEach((value, key) => {
      authorCountObj[key] = value;
    });

    console.log(authorCountObj);

//  check if object is empty
if (Object.keys(authorCountObj).length !== 0) {




  fetch("http://localhost:1234/channels", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
        channelID: message.channel.id,
        channelName: message.channel.name,
        creator: messagesArray[messagesArray.length - 1].author,
      count: authorCountObj,

    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });


    // send back a message with the author count
    message.channel.send(formatMessages(authorCountObj));

}



});

client.once("ready", async () => {
  console.log(`Ready! Logged in as ${client.user.tag}`);
  logActiveThreads();
  setInterval(logActiveThreads, 60000); // Check every minute
});

client.login(token);


function formatMessages(authorCountObj) {
    let formattedMessages = "";
    for (const [key, value] of Object.entries(authorCountObj)) {
        formattedMessages += `${key}: ${value}\n`;
    }
    return formattedMessages;
 
}