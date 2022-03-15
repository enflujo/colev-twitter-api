import 'dotenv/config';
import mongoose from 'mongoose';
import http from 'http';
import path from 'path';
import express from 'express';
import { Server } from 'socket.io';
import { ETwitterStreamEvent, TwitterApi } from 'twitter-api-v2';
import entradaSchema from '../models/Tweet.js';
import palabrasClaves from '../models/palabrasClaves.js';
import camposBusqueda from '../models/camposBusqueda.js';

const { MONGO_USER, MONGO_PASS, TWITTER_BEARER_TOKEN: TOKEN } = process.env;
const MONGODB_URI = `mongodb://${MONGO_USER}:${MONGO_PASS}@localhost:27017`;
const mc = mongoose.connection;
const Port = process.env.Port || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);
let collection = mongoose.model('Tweet', entradaSchema);
const twitter = new TwitterApi(TOKEN);

app.use(express.static('client'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../', 'client', 'index.html'));
});

app.get('/prueba', (req, res) => {
  collection.find((err, datos) => {
    if (err) return console.error(err);

    res.send(datos);
  });
});

io.on('connection', async () => {
  console.log('Client connected...');
});

server.listen(Port, () => console.log(`Listening on port ${Port}`));

/// DB connection

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mc.once('open', async (req, res) => {
  console.log('database connected to', MONGODB_URI);

  const reglas = await twitter.v2.streamRules();
  if (reglas.data?.length) {
    await twitter.v2.updateStreamRules({
      delete: { ids: reglas.data.map((rule) => rule.id) },
    });
  }

  await twitter.v2.updateStreamRules({
    add: palabrasClaves.covid19.map((palabra) => {
      return { value: `${palabra} place_country:CO` };
    }),
  });

  const flujo = await twitter.v2.searchStream(camposBusqueda);
  flujo.autoReconnect = true;
  flujo.on(ETwitterStreamEvent.Data, async (tweet) => {
    try {
      io.emit('tweet', tweet);
      collection.insertMany(
        {
          text: tweet.data.text,
          author_id: tweet.data.author_id,
          id: tweet.data.id,
          conversation_id: tweet.data.conversation_id,
        },
        (err, result) => {
          if (err) console.log(err);
          if (result) {
            console.log('datos insertados');
          }
        }
      );
    } catch (error) {
      throw new Error(error);
    }

    // TODO: Revisar esta parte del ejemplo, se puede filtrar los que son retweets:

    // Ignore RTs or self-sent tweets
    // const isARt = tweet.data.referenced_tweets?.some((tweet) => tweet.type === 'retweeted') ?? false;
    // if (isARt || tweet.data.author_id === meAsUser.id_str) {
    //   return;
    // }
  });
});

mc.on('error', (err) => {
  console.log(err);
});
