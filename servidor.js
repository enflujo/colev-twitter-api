import 'dotenv/config';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import mongoose from 'mongoose';
import http from 'http';
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { ETwitterStreamEvent, TwitterApi } from 'twitter-api-v2';
import entradaSchema from './modelos/Tweet.js';
import palabrasClaves from './modelos/palabrasClaves.js';
import camposBusqueda from './modelos/camposBusqueda.js';
import fs from 'fs';
import { parse } from 'csv-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { MONGO_USER, MONGO_PASS, TWITTER_BEARER_TOKEN: TOKEN } = process.env;
const MONGODB_URI = `mongodb://${MONGO_USER}:${MONGO_PASS}@localhost:27017`;
const mc = mongoose.connection;
const Port = process.env.Port || 3000;

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server);
const collection = mongoose.model('Tweet', entradaSchema);
const twitter = new TwitterApi(TOKEN);

async function CSVParse() {
  const __dirname = dirname(fileURLToPath(import.meta.url));

  const processFile = async () => {
    let contador = 0;
    let tweetsGuardadosParser = [];
    const tweetsGuardadosParserLimit = 100;
    const parser = fs.createReadStream(`${__dirname}/dist/datos/covid19_string.csv`).pipe(
      parse({
        delimiter: ',',
        trim: true,
        columns: true,
        encoding: 'utf8',
      })
    );
    for await (const fila of parser) {
      if (tweetsGuardadosParser.length <= tweetsGuardadosParserLimit) {
        // Work with each fila
        // console.log(fila);
        if (fila['attachments.media']) {
          fila['attachments.media'] = JSON.parse(fila['attachments.media']);
          // console.log(fila['attachments.media']);
        } else {
          fila['attachments.media'] = [];
        }
        if (fila.context_annotations) {
          fila.context_annotations = JSON.parse(fila.context_annotations);
          // console.log(fila['attachments.media']);
        } else {
          fila.context_annotations = [];
        }
        if (fila['entities.urls']) {
          fila['entities.urls'] = JSON.parse(fila['entities.urls']);
        } else {
          fila['entities.urls'] = [];
        }
        tweetsGuardadosParser.push(fila);
      } else {
        //cuando tweetsGuardadosParser es >= 100
        try {
          console.log('Guardando', contador);
          contador++;
          await collection.insertMany(tweetsGuardadosParser); //guarda los tweets cuando llega a 100
          tweetsGuardadosParser = []; //desocupa tweetsGuardadosParser
        } catch (error) {
          console.log('ERROR GUARDANDO EN MONGO');
          throw new Error(error);
        }
      }
    }
  };

  (async () => {
    const tweetsGuardadosParser = await processFile();
    // console.info(`todos los tweetsGuardadosParser`, tweetsGuardadosParser);
  })();
}

app.use(express.static('dist'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'dist', 'index.html'));
});

app.get('/prueba', async (req, res) => {
  const todos = await collection.find({});
  res.send(todos);
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
  CSVParse();

  // const reglas = await twitter.v2.streamRules();
  // if (reglas.data?.length) {
  //   await twitter.v2.updateStreamRules({
  //     delete: { ids: reglas.data.map((rule) => rule.id) },
  //   });
  // }

  // await twitter.v2.updateStreamRules({
  //   add: palabrasClaves.covid19.map((palabra) => {
  //     return { value: `(${palabra}) place_country:US` };
  //   }),
  // });

  // const flujo = await twitter.v2.searchStream(camposBusqueda);
  // flujo.autoReconnect = true;
  // flujo.on(ETwitterStreamEvent.Data, async (tweet) => {
  //   const tweetsIncludes = tweet.includes.tweets;
  //   // const elPrimero = tweetsIncludes[0].public_metrics;
  //   // tweetsIncludes.forEach(t => {
  //   // console.log(t.public_metrics)
  //   // })
  //   try {
  //     io.emit('tweet', tweet);
  //     collection.insertMany(
  //       {
  //         text: tweet.data.text,
  //         author_id: tweet.data.author_id,
  //         id: tweet.data.id,
  //         conversation_id: tweet.data.conversation_id,
  //       },
  //       (err, result) => {
  //         if (err) console.log(err);
  //         if (result) {
  //           console.log('datos insertados');
  //         }
  //       }
  //     );
  //   } catch (error) {
  //     throw new Error(error);
  //   }

  // TODO: Revisar esta parte del ejemplo, se puede filtrar los que son retweets:

  // Ignore RTs or self-sent tweets
  // const isARt = tweet.data.referenced_tweets?.some((tweet) => tweet.type === 'retweeted') ?? false;
  // if (isARt || tweet.data.author_id === meAsUser.id_str) {
  //   return;
  // }
  // });
});

mc.on('error', (err) => {
  console.log(err);
});
