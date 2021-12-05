require("dotenv").config();

const { Client, Intents, Message, MessageEmbed } = require("discord.js");
const fetch = require("cross-fetch");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const prefix = "?";

const random = (imgs) => imgs[Math.floor(Math.random() * imgs.length)];
const images = [
  "https://i.pinimg.com/736x/cc/2a/52/cc2a52b9bac7ea9a35b2fc6a883f3194.jpg",
  "https://img.myloview.se/fototapeter/schweinenacken-fleisch-400-12607201.jpg",
  "https://www.willms-fleisch.de/fileadmin/user_upload/QUALITAET.png",
  "https://cdn.hofstädter.at/app/uploads/2020/08/HOFSTAEDTER_NIEDERTEMPERATURGAREN_CONTENT_2748.jpg",
  "https://cdn.discordapp.com/attachments/767688737806090264/913068399897235486/3AA610F4-18BC-4491-AAAB-CB3AE2BFD8FD.jpg",
  "https://c.tenor.com/7_CgY1OmC5AAAAAC/meat-beef.gif",
];

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
  if (
    message.content.includes(`${prefix}gaming`) &&
    message.author.bot === false
  ) {
    message.channel.send(`${nameTrim(message.author.tag)}, äre gaming?`);
  }

  //väder

  if (
    message.content.includes(`${prefix}vader`) &&
    message.author.bot === false
  ) {
    let stad = message.content.split(" ")[1];

    if (message.content.split(" ").length >= 3) {
      stad = message.content.split(" ")[1] +=
        " " + message.content.split(" ")[2];
    }

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
            let vaderLand = `${vaderparse.name}, ${vaderparse.sys.country}`;
            let embedvader = new MessageEmbed();
            embedvader.addField("Plats", vaderLand);
            embedvader.addField("Väder", check(vaderparse));
            embedvader.addField(
              "Temperatur",
              `${Math.round(vaderparse.main.temp)}°C`
            );
            embedvader.setColor("RANDOM");
            embedvader.setTitle("Vädret just nu");
            message.channel.send({ embeds: [embedvader] });
          }
        });
    }
  }
  //vader end
  //bilder
  const randomImage = random(images);
  if (
    message.content.includes(`${prefix}fleisch`) &&
    message.author.bot === false
  ) {
    message.channel.send({
      files: [
        {
          attachment: `${randomImage}`,
        },
      ],
    });
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
    console.log(vdrtyp);
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
      case "Snow":
        temp = "Snö";
        break;
      case "Mist":
        temp = "Dimma";
        break;
    }

    return temp;
  }
}

// `
// Nuvarande väder
// Plats: ${vaderparse.name}, ${vaderparse.sys.country}
// Väder: ${check(vaderparse)}
// Temperatur: ${Math.round(vaderparse.main.temp)}°C
// `
