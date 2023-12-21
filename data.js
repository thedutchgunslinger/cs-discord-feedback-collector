const fs = require("fs");
const path = require("path");

const megaLog = require("./megaLog.json");

const count = {};

const authorChannels = {};

// unique channelsId
const channels = new Set();

const authors = new Set();

const creator = {};

megaLog.channels.forEach((msg) => {
//   only keep unique channelsId
    // console.log(msg.channelID);

    channels.add(msg.channelID);

});


// console.log(channels);


// get all channels from megaLog that are in channels
const channelsArray = [];

channels.forEach((channel) => {
    channelsArray.push(megaLog.channels.find((msg) => msg.channelID === channel));
});


// count messages per author in count
channelsArray.forEach((channel) => {
//  console.log(channel)
//  turn channel.count into an array of objects
    const channelCount = Object.entries(channel.count);
    // console.log(channelCount);
    // channelCount.forEach((author) => {
    //     if (count[author[0]]) {
    //         count[author[0]] += author[1];
    //     } else {
    //         count[author[0]] = author[1];
    //     }
    // });

    // count creator
    if (creator[channel.creator]) {
        creator[channel.creator] += 1;
    } else {
        creator[channel.creator] = 1;
    }
    

    channelCount.forEach((author) => {
        // if author is in authors, add to count
        // else add author to authors and set count to 1
        if (authors.has(author[0])) {
            count[author[0]] += author[1];
            // console.log("author", author);
        } else {
            authors.add(author[0]);
            count[author[0]] = author[1];
        }

    // authors.add(author);
    
        });
});


console.log("count", count);

// console.log(channelsArray);

// write count to file
fs.writeFileSync(
    path.join(__dirname, "messageCount.json"),
    JSON.stringify(count, null, 2),
    "utf-8"
);

fs.writeFileSync(
  path.join(__dirname, "threadsCreated.json"),
  JSON.stringify(creator, null, 2),
  "utf-8"
);

console.log("creator", creator);