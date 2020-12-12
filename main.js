require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

//funcion para el estado del bot
function estadoDelBot(){
    client.user.setPresence ({
        status: 'online',
        activity: {
            name: 'las Noticias 😎',
            type: 'LISTENING'
        }
    });
};

client.on('ready', () => {
    console.log(`Conectado... ${client.user.tag}`);
    estadoDelBot(); //Llamamos la funcion de estado
});

const Twitter = require('twit');
const twitterConf = {
    consumer_key: process.env.API_KEY,
    consumer_secret: process.env.API_KEY_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
  }
const twitterClient = new Twitter(twitterConf);
// Specify destination channel ID below
const CHANNEL_ID = process.env.CHANNEL_ID;
const dest = CHANNEL_ID; //Channel ID (Discord)

// Create a stream to follow tweets
const USER_ID = process.env.USER_ID;
const USER_ID_TWO = process.env.USER_ID_TWO
const stream = twitterClient.stream('statuses/filter', {
  follow: USER_ID, // user_id (Discord)
});

stream.on('tweet', tweet => {
    if(tweet.retweeted || tweet.retweeted_status || tweet.in_reply_to_status_id || tweet.in_reply_to_user_id || tweet.delete) {
        // skip retweets and replies
        return;
      }
  const twitterMessage = `NEWS!! @here **${tweet.user.name}** acaba de realizar un nuevo tweet :grin: \n\nhttps://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;
  try {
      let channel =  client.channels.fetch(dest).then(channel => { channel.send(twitterMessage)
      }).catch(err => {
          console.log(err)
      })

  } catch (error) {
      console.error(error);
}
});

let newTweet = twitterClient.stream('statuses/filter', { follow: USER_ID_TWO })

newTweet.on('tweet', function (tweet) {
  console.log(tweet.text)
});


const prefix = process.env.PREFIX; //Llamamos al Prefix


client.on('message', (message) => {

if(message.author.bot) return; //No responder a mensajes de otros Bots
if(!message.content.startsWith(prefix)) return; //No responder si el contenido del mensaje no empieza por el prefix

//Definimos prefix y commands
const args = message.content.slice(prefix.length).trim().split(' ');
const command = args.shift().toLocaleLowerCase();

if( command === 'ayuda'){
    message.channel.send('Hola :wave: Lo siento, por ahora no puedo ayudarte, Este bot aun esta en fase BETA!! :pensive: ').then(msg => msg.delete({timeout: 3000}));;

    message.delete();
}

});

client.login(DISCORD_TOKEN);