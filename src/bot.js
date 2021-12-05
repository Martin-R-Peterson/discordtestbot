require("dotenv").config();

// const { Client } = require("discord.js");

// const client = new Client();
const { Client, Intents, Message } = require("discord.js");
const fetch = require("cross-fetch");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const prefix = "?";
// const client = new Client({
//   intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
// });

client.on("ready", () => {
  console.log(`${client.user.tag} har loggat in.`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot === true) return;
  if (message.content === "hej") {
    message.reply("Hej snygging");
  }
  if (message.content === "Godmorgon" || message.content === "godmorgon") {
    message.channel.send(
      `Godmorgon ${nameTrim(message.author.tag)}, hoppas du har en trevlig dag.`
    );
  }

  //väder

  if (
    message.content.includes(`${prefix}vader`) &&
    message.author.bot === false
  ) {
    let stad = message.content.split(" ")[1];
    if (stad === undefined) return;
    else {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${stad}&appid=${process.env.Weather_API_Discord}&units=metric`
      )
        .then((response) => {
          return response.json();
        })
        .then((vaderparse) => {
          if (vaderparse.cod === "404") {
            //console.log("1");
            message.channel.send("Staden Existerar inte");
          } else {
            console.log("2");
            message.channel.send(
              `
                Nuvarande väder
                Plats: ${vaderparse.name}, ${vaderparse.sys.country}
                Väder: ${check(vaderparse)}
                Temperatur: ${Math.round(vaderparse.main.temp)}°C 
                `
            );
          }
        });
    }
  }
});

client.login(process.env.DiscordBotToken);

function nameTrim(input) {
  let name = input.slice(0, -5);
  return name;
}

function check(input) {
  if (typeof input.main != "undefined") {
    let vdrtyp = input.weather[0].main;
    let temp = " ";
    switch (vdrtyp) {
      case "Clear":
        temp = "Klart";
        break;
      case "rain":
        temp = "Regn";
        break;
      case "drizzle":
        temp = "Duggregn";
        break;
      case "Clouds":
        temp = "Molnigt";
        break;
    }

    return temp;
  }
}
