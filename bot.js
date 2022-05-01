// Connecting Discord.js , Creating A Client For The Bot And Requiring Node-Fetch
const discord = require("discord.js");
const client = new discord.Client();
const fetch = require("node-fetch");
// init dotenv
require("dotenv").config();
// Discord Bot Secret Key
const Bot_Key = process.env.BOT_KEY;
// Spotify API Key And Secret Key
const spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;
// Giphy API Key And Secret Key
const giphy_Key = process.env.GIPHY_KEY;
// Handling The Connection Of The Bot
client.on("ready", () => {
  // When Connected Log The Bot Name
  console.log("bot connected as " + client.user.tag);
  // Set The Activity Of The Bot
  client.user.setActivity("The Server", { type: "WATCHING" });
  // Getting The Discord Groups That The Bot Is Connected To
  client.guilds.forEach((guild) => {
    console.log(guild.name);
    // Getting The Channels In Each Group
    guild.channels.forEach((channel) => {
      console.log(` - ${channel.name} - ${channel.type} - ${channel.id}`);
    });
  });
});
// Handling Received Messages
client.on("message", (receivedMessage) => {
  if (receivedMessage.author == client.user) {
    return;
  } else {
    // Checking If The Message Is A Command
    if (receivedMessage.content.startsWith("!")) {
      processCommand(receivedMessage);
    }
  }
});
// Handling The Bot Commands
function processCommand(receivedMessage) {
  let fullCommand = receivedMessage.content.substr(1);
  let splitCommand = fullCommand.split(" ");
  let primaryCommand = splitCommand[0];
  let arguements = splitCommand.slice(1);
  if (primaryCommand == "help") {
    helpCommand(arguements, receivedMessage);
  } else if (primaryCommand == "play") {
    playCommand(arguements, receivedMessage);
  } else if (primaryCommand == "gif") {
    gifCommand(arguements, receivedMessage);
  } else if (primaryCommand == "kick") {
    kickCommand(arguements, receivedMessage);
  } else if (primaryCommand == "ban") {
    banCommand(arguements, receivedMessage);
  } else if (primaryCommand == "invite") {
    inviteCommand(arguements, receivedMessage);
  } else if (primaryCommand == "add") {
    addCommand(arguements, receivedMessage);
  } else {
    receivedMessage.channel.send(
      "Unknown Command. Try `!help` To Check Available Commands"
    );
  }
}
// Function To List The Commands Available
function helpCommand(arguements, receivedMessage) {
  if (arguements.length == 0) {
    // Setting The Commands Array Of Objects
    const commands = [
      {
        Name: "!help",
        Description: "To Show Available Commands",
      },
      {
        Name: "!gif",
        Description: "To Get A Random GIF According To What You Search",
      },
      {
        Name: "!play",
        Description: "To Play A Song In The Voice Channel",
      },
      {
        Name: "!pause",
        Description: "To Pause The Song From Playing",
      },
      {
        Name: "!stop",
        Description: "To Stop The Song And Close It",
      },
      {
        Name: "!kick",
        Description: "Kick A Specific Number (Only Available For Mods)",
      },
      {
        Name: "!ban",
        Description: "Ban A Specific Number (Only Available For Mods)",
      },
      {
        Name: "!invite",
        Description: "Get The Invite Link For The Guild",
      },
    ];
    // Looping Throw All The Commands
    let availableCommands = "";
    const commandsNumber = commands.length;
    for (let i = 0; i < commandsNumber; i++) {
      availableCommands +=
        `${i + 1}` +
        "- " +
        commands[i].Name +
        ": " +
        commands[i].Description +
        "\n";
    }
    let commandsMessage = `Available Commands: \n` + availableCommands;
    receivedMessage.channel.send(commandsMessage);
  } else {
    receivedMessage.channel.send(
      "Please Don't Type Anything After The `!help` Command"
    );
  }
}
// Fucntion To Play Music
function playCommand(arguements, receivedMessage) {
  console.log("play");
}
// Function To Request Data From The Giphy API
function gifCommand(arguements, receivedMessage) {
  if (arguements.length == 0) {
    receivedMessage.channel.send(
      "You Must Select A GIF Name After The `!gif` Command"
    );
  } else {
    try {
      // Requesting Data From Giphy API
      const giphy_url = `https://api.giphy.com/v1/gifs/search?api_key=${giphy_Key}&q=${arguements}`;
      fetch(giphy_url)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          let totalGifs = data.data.length;
          if (totalGifs > 0) {
            let randomGifIndex = Math.floor(Math.random() * totalGifs);
            let randomGif = data.data[randomGifIndex].images.fixed_height.url;
            let Gifattachment = new discord.Attachment(randomGif);
            receivedMessage.channel.send(Gifattachment);
          } else {
            receivedMessage.channel.send(
              "No GIF's were found for: " + arguements.join(" ")
            );
          }
        });
    } catch (error) {
      console.log("GIF Error: " + error);
      receivedMessage.channel.send(
        "Sorry something went wrong retry the command to get the GIF"
      );
    }
  }
}
// Function To Kick A Specific User From The Channel
function kickCommand(arguements, receivedMessage) {
  let sender = receivedMessage.author.toString();
  if (receivedMessage.member.hasPermission(["KICK_MEMBERS", "BAN_MEMBERS"])) {
    if (arguements.length == 0) {
      receivedMessage.channel.send(
        sender + " You Need To Select A User After The Command `!kick`"
      );
    } else {
      let kickedMember = receivedMessage.mentions.members.first();
      kickedMember
        .kick("You Have Been Kicked For Violating The Server's Rules")
        .then(function () {
          receivedMessage.reply("You Kicked " + kickedMember + " Successfuly");
        })
        .catch(function (error) {
          receivedMessage.reply(
            "Unable To Kick User: " + kickedMember.displayName
          );
          console.log(error);
        });
    }
  } else {
    receivedMessage.channel.send(
      sender + " You Are Not Allowed To Perform This Action"
    );
  }
}
// Function To Ban A Specific User From The Channel
function banCommand(arguements, receivedMessage) {
  let sender = receivedMessage.author.toString();
  if (receivedMessage.member.hasPermission(["KICK_MEMBERS", "BAN_MEMBERS"])) {
    if (arguements.length == 0) {
      receivedMessage.channel.send(
        sender + " You Need To Select A User After The Command `!ban`"
      );
    } else {
      let bannedMember = receivedMessage.mentions.members.first();
      bannedMember
        .ban({
          reason: "You Have Been Banned For Violating The Server's Rules",
        })
        .then(function () {
          receivedMessage.reply("You Banned " + bannedMember + " Successfuly");
        })
        .catch(function (error) {
          receivedMessage.reply(
            "Unable To Ban User: " + bannedMember.displayName
          );
          console.log(error);
        });
    }
  } else {
    receivedMessage.channel.send(
      sender + " You Are Not Allowed To Perform This Action"
    );
  }
}
// Function To Give The Link To The Guild
function inviteCommand(arguements, receivedMessage) {
  if (arguements.length == 0) {
    receivedMessage.channel
      .createInvite()
      .then(function (invite) {
        receivedMessage.channel.send(invite.url);
      })
      .catch(console.error);
  } else {
    receivedMessage.reply("Don't Type Anything After The Command `!invite`");
  }
}
// Function To Send Invite To A User
function addCommand(arguements, receivedMessage) {
  // Send A DM To The User Invited With The Invite Link
}
// Bot Login With The Bot Secret Code
client.login(Bot_Key);
