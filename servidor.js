import 'dotenv/config';
import { domainToASCII, fileURLToPath } from 'url';
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
import camposBasicosEsquema from './modelos/camposBasicos.js';
import camposUsuariosEsquema from './modelos/camposUsuarios.js';
import camposMediosAdjuntosEsquema from './modelos/camposMediosAdjuntos.js';
import camposLugaresEsquema from './modelos/camposLugares.js';
import camposEncuestasEsquema from './modelos/camposEncuestas.js';
import fs, { writeFileSync } from 'fs';
import { parse } from 'csv-parse';
import axios from 'axios';
// import { setDefaultResultOrder } from 'dns/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const normalizarTexto = (texto) =>
  texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();

/**
 * Guardar datos localmente en archivo .json
 * @param {Object} json Datos que se quieren guardar en formato JSON.
 * @param {String} nombre Nombre del archivo, resulta en ${nombre}.json
 */
export const guardarJSON = (json, nombre) => {
  writeFileSync(`./dist/datos/${nombre}.json`, JSON.stringify(json, null, 2));
};

const { MONGO_USER, MONGO_PASS, TWITTER_BEARER_TOKEN: TOKEN } = process.env;
const MONGODB_URI = `mongodb://${MONGO_USER}:${MONGO_PASS}@localhost:27017`;
const mc = mongoose.connection;
const Port = process.env.Port || 3000;

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server);
const collection = mongoose.model('Tweet', entradaSchema);
const collectionCamposBasicos = mongoose.model('camposBasicos', camposBasicosEsquema);
const collectionCamposUsuarios = mongoose.model('camposUsuarios', camposUsuariosEsquema);
const collectionCamposMediosAdjuntos = mongoose.model('camposMediosAdjuntos', camposMediosAdjuntosEsquema);
const collectionCamposLugares = mongoose.model('camposLugares', camposLugaresEsquema);
const collectionCamposEncuestas = mongoose.model('camposEncuestas', camposEncuestasEsquema);
const twitter = new TwitterApi(TOKEN);

// Importar JSON directamente al Mongodb

// const covidDatosJSON = JSON.parse(fs.readFileSync(__dirname + '/dist/datos/covid19.jsonl', 'utf-8'));

async function importarJsonDirectamente() {
  const flujo = fs.createReadStream(`${__dirname}/dist/datos/covid19.jsonl`);
  const procesador = json.parse();
  console.log('EMPEZANDO A CARGAR JSON');
  procesador.on('data', (tweet) => {
    console.log(tweet);
  });

  flujo.pipe(procesador);
  console.log('se mando a la tuberia');
  // where the data will end up
  // const outputDBConfig = {
  //   dbURL: `mongodb://${MONGO_USER}:${MONGO_PASS}@localhost:27017`,
  //   collection: 'entradaSchema',
  // };
  // // create the writable stream
  // const writableStream = streamToMongoDB(outputDBConfig);
  // // create readable stream and consume it
  // fs.createReadStream('/dist/datos/covid19.jsonl').pipe(JSONStream.parse('*')).pipe(writableStream);
  //
  // const pipeline = chain([
  //   fs.createReadStream('/dist/datos/covid19.jsonl'),
  //   parser(),
  //   pick({ filter: 'datos' }),
  //   ignore({ filter: /\b_meta\b/i }),
  //   streamValues(),
  //   (datos) => {
  //     const dato = datos;
  //     // keep data only for the accounting department
  //     return dato;
  //   },
  // ]);
  // let counter = 0;
  // pipeline.on('dato', () => ++counter);
  // pipeline.on('end', () => console.log('Se han guardado todos los datos'));
}

async function tendencias() {
  let contador = 0;
  const palabrasGuardadas = [];
  const parser = fs.createReadStream(`${__dirname}/dist/datos/covid19_string.csv`).pipe(
    parse({
      delimiter: ',',
      trim: true,
      columns: true,
      encoding: 'utf8',
    })
  );
  for await (const fila of parser) {
    // console.log('procesando fila', contador);
    const texto = fila.text;
    const palabras = texto.split(' ');
    const fecha = fila.created_at;

    for (let i = 0; i < palabras.length; i++) {
      const palabraNormalizada = normalizarTexto(palabras[i]);
      if (palabraNormalizada.length < 3) continue;
      // Cualquier tipo de URL
      const regUrls =
        /(http:\/\/|ftp:\/\/|https:\/\/|www\.)([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?(\s|[0-9_]|([^a-zA-Z]+))/g;
      if (palabraNormalizada.match(regUrls)) continue;

      // Hashtags o Menciones con @
      if (palabraNormalizada.match(/([#@]+[a-zA-Z0-9(_)]{1,})/g)) continue;

      // Omitir estas palabras
      const regex =
        /\b(que|los|por|del|con|para|las|una|mas|esta|the|como|pero|and|este|hay|sin|nos|tiene|porque|sus|that|les|desde|per|covid-19|covid19|covid|2019-ncov|ncov|sars-cov-2|sarscov2|corona-virus|coronavirus)\b/g;
      if (palabraNormalizada.match(regex)) continue;

      const palabraI = palabrasGuardadas.findIndex((obj) => {
        return obj.palabraNormalizada === palabraNormalizada;
      });

      if (palabraI >= 0) {
        palabrasGuardadas[palabraI].fechas.push(fecha);
      } else {
        palabrasGuardadas.push({
          palabra: palabras[i],
          palabraNormalizada: palabraNormalizada,
          fechas: [fecha],
        });
      }
    }

    contador++;
  }
  try {
    guardarJSON(palabrasGuardadas, 'tendencias');
  } catch (error) {
    console.log(error);
  }
}

async function CSVParse() {
  const __dirname = dirname(fileURLToPath(import.meta.url));

  const processFile = async () => {
    let contador = 0;
    let tweetsGuardadosParser = [];
    const tweetsGuardadosParserLimit = 100;
    const parser = fs.createReadStream(`${__dirname}/dist/datos/covid19_string_parte.csv`).pipe(
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

    guardarJSON(palabrasGuardadas, 'tendencias');
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
  // tendencias();
  // const todos = await collection.find({});
  // res.send(todos);
});

io.on('connection', async () => {
  console.log('Client connected...');
});
// importarJsonDirectamente();
server.listen(Port, () => console.log(`Listening on port ${Port}`));

/// DB connection

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mc.once('open', async (req, res) => {
  console.log('database connected to', MONGODB_URI);
  // CSVParse();

  const reglas = await twitter.v2.streamRules();
  if (reglas.data?.length) {
    await twitter.v2.updateStreamRules({
      delete: { ids: reglas.data.map((rule) => rule.id) },
    });
  }

  await twitter.v2.updateStreamRules({
    add: palabrasClaves.covid19.map((palabra) => {
      return { value: `(${palabra}) place_country:US` };
    }),
  });
});

////////////////////////REST API

async function twitterRestAPI() {
  const instanciaAxios = axios.create({
    baseURL: 'https://api.twitter.com/2/tweets/search',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  try {
    const { data } = await instanciaAxios.get(`/all`, {
      params: {
        query: 'poll',
        start_time: '2019-03-01T00:00:00Z',
        end_time: '2020-12-12T01:00:00Z',
        max_results: 50,
        'tweet.fields':
          'attachments,author_id,context_annotations,conversation_id,created_at,entities,geo,id,in_reply_to_user_id,lang,possibly_sensitive,public_metrics,referenced_tweets,reply_settings,source,text,withheld',
        expansions:
          'attachments.media_keys,attachments.poll_ids,author_id,entities.mentions.username,geo.place_id,in_reply_to_user_id,referenced_tweets.id,referenced_tweets.id.author_id',
        'media.fields':
          'media_key,duration_ms,height,preview_image_url,type,url,width,public_metrics,alt_text,variants',
      },
    });
    console.log(data.includes.poll);

    /////////////////////Datos Basicos de los tweets
    data.data.forEach((t) => {
      collectionCamposBasicos.insertMany(
        {
          attachments: t.attachments,
          author_id: t.author_id,
          context_annotations: t.context_annotations,
          conversation_id: t.conversation_id,
          created_at: t.created_at,
          entities: t.entities,
          geo: t.geo,
          id: t.id,
          in_reply_to_user_id: t.in_reply_to_user_id,
          lang: t.lang,
          possibly_sensitive: t.possibly_sensitive,
          public_metrics: t.public_metrics,
          referenced_tweets: t.referenced_tweets,
          reply_settings: t.reply_settings,
          source: t.source,
          text: t.text,
          withheld: t.withheld,
        },
        (err, resultado) => {
          if (err) console.log(err);
          if (resultado) {
            console.log('datos insertados desde el REST API para los campos basicos de los campos del tweet');
          }
        }
      );
    });

    // /////////////////Campos de medios adjuntos
    data.includes.media.forEach((m) => {
      collectionCamposMediosAdjuntos.insertMany(
        {
          duration_ms: m.duration_ms,
          type: m.type,
          height: m.height,
          media_key: m.media_key,
          public_metrics: m.public_metrics,
          preview_image_url: m.preview_image_url,
          width: m.width,
          url: m.url,
          variants: m.variants,
        },
        (err, resultado) => {
          if (err) console.log(err);
          if (resultado) {
            console.log('datos insertados desde el REST API para el campo de medios adjuntos');
          }
        }
      );
    });

    // /////////////////Campos de usuarios
    data.includes.users.forEach((u) => {
      collectionCamposUsuarios.insertMany(
        {
          id: u.id,
          name: u.name,
          username: u.username,
          created_at: u.created_at,
          description: u.description,
          entities: u.entities,
          location: u.location,
          pinned_tweet_id: u.pinned_tweet_id,
          profile_image_url: u.profile_image_url,
          protected: u.protected,
          public_metrics: u.public_metrics,
          url: u.url,
          verified: u.verified,
          withheld: u.withheld,
        },
        (err, resultado) => {
          if (err) console.log(err);
          if (resultado) {
            console.log('datos insertados desde el REST API para el campo de medios adjuntos');
          }
        }
      );
    });

    /////////////////////Campos Lugares
    data.includes.place.forEach((l) => {
      collectionCamposLugares.insertMany(
        {
          geo: l.geo,
        },
        (err, resultado) => {
          if (err) console.log(err);
          if (resultado) {
            console.log('datos insertados desde el REST API para los campos basicos de los campos del tweet');
          }
        }
      );
    });

    /////////////////////Campos Encuestas
    data.includes.poll.forEach((e) => {
      collectionCamposEncuestas.insertMany(
        {
          pool: e.pool,
        },
        (err, resultado) => {
          if (err) console.log(err);
          if (resultado) {
            console.log('datos insertados desde el REST API para los campos basicos de los campos del tweet');
          }
        }
      );
    });

    // guardarJSON(data.data, './prueba-data');
    // guardarJSON(data.includes, './prueba-includes');
  } catch (err) {
    console.log(err);
  }

  // const query = palabrasClaves.covid19.join(' OR ');
  // try {
  //   const resultado = await twitter.v2.get('tweets/search/all', {
  //     query: [query],
  //     start_time: '2019-03-01T00:00:00Z',
  //     end_time: '2020-12-12T01:00:00Z',
  //     max_results: 50,
  //     expansions:
  //       'author_id,referenced_tweets.id,in_reply_to_user_id,geo.place_id,attachments.media_keys,attachments.poll_ids,entities.mentions.username,referenced_tweets.id.author_id',
  //     // 'tweet.fields':
  //     //   'id,created_at,text,author_id,in_reply_to_user_id,referenced_tweets,attachments,withheld,geo,entities,public_metrics,possibly_sensitive,source,lang,context_annotations,conversation_id,reply_settings',
  //     'user.fields':
  //       'id,created_at,name,username,protected,verified,withheld,profile_image_url,location,url,description,entities,pinned_tweet_id,public_metrics',
  //     // 'media.fields': 'media_key,duration_ms,height,preview_image_url,type,url,width,public_metrics,alt_text',
  //     // 'place.fields':
  //     //   'id,name,country_code,place_type,full_name,country,contained_within,geo&poll.fields=id,options,voting_status,end_datetime,duration_minutes',
  //     // 'poll.fields': 'id,options,voting_status,end_datetime,duration_minutes',
  //     // pagination_token: 'meta.next_token',
  //   });
  //   console.log(`resultados = `, resultado);
  //   resultado.data.forEach((t) => {
  //     collection.insertMany(
  //       {
  //         id: t.id,
  //         text: t.text,
  //         conversation_id: t.conversation_id,
  //         referenced_tweets: t.referenced_tweets,
  //         author_id: t.author_id,
  //         in_reply_to_user_id: t.in_reply_to_user_id,
  //         retweeted_user_id: t.retweeted_user_id,
  //         quoted_user_id: t.quoted_user_id,
  //         created_at: t.created_at,
  //         lang: t.lang,
  //         source: t.source,
  //         public_metrics: t.public_metrics,
  //         reply_settings: t.reply_settings,
  //         withheld: t.withheld,
  //         possibly_sensitive: t.possibly_sensitive,
  //         entities: t.entities,
  //         context_annotations: t.context_annotations,
  //         attachments: t.attachments,
  //         pool: t.pool,
  //         author: t.users,
  //         geo: t.place,
  //       },
  //       (err, resultado) => {
  //         if (err) console.log(err);
  //         if (resultado) {
  //           console.log('datos insertados desde el REST API');
  //         }
  //       }
  //     );
  //     console.log(`cada tweet`, t);
  //   });
  //   // console.log(tweetsDesdeApiRest); // TweetV2[]
  // } catch (error) {
  //   throw new Error(error);
  // }
}
twitterRestAPI();

////////////////////////STREAM API

const flujo = await twitter.v2.searchStream(camposBusqueda);
flujo.autoReconnect = true;
flujo.on(ETwitterStreamEvent.Data, async (tweet) => {
  const tweetsIncludes = tweet.includes.tweets;
  // const elPrimero = tweetsIncludes[0].public_metrics;
  // tweetsIncludes.forEach(t => {
  // console.log(t.public_metrics)
  // })
  try {
    io.emit('tweet', tweet);

    // const datosAGuardar = {
    //   id: tweet.data.id,
    //   conversation_id: tweet.data.conversation_id,
    // };

    // datosAGuardar.referenced_tweets = tweet.data.referenced_tweets;

    // collection.insertMany(
    //   {
    //     id: tweet.data.id,
    //     conversation_id: tweet.data.conversation_id,
    //     referenced_tweets: tweet.data.referenced_tweets,
    //     author_id: tweet.data.author_id,
    //     in_reply_to_user_id: tweet.data.in_reply_to_user_id,
    //     retweeted_user_id: tweet.data.retweeted_user_id,
    //     quoted_user_id: tweet.data.quoted_user_id,
    //     created_at: tweet.data.created_at,
    //     text: tweet.data.text,
    //     lang: tweet.data.lang,
    //     source: tweet.data.source,
    //     public_metrics: tweet.data.public_metrics,
    //     reply_settings: tweet.data.reply_settings,
    //     withheld: tweet.data.withheld,
    //     possibly_sensitive: tweet.data.possibly_sensitive,
    //     entities: tweet.data.entities,
    //     context_annotations: tweet.data.context_annotations,
    //     attachments: tweet.includes,
    //     pool: tweet.includes.polls,
    //     author: tweet.includes.users,
    //     geo: tweet.includes.places,
    //     /**
    //      * if (tweet.includes.media) {
    //      *   image = tweet.includes.media[0].url
    //      * } else {
    //      *   image = null
    //      * }
    //      */
    //   },
    //   (err, resultado) => {
    //     if (err) console.log(err);
    //     if (resultado) {
    //       console.log('datos insertados');
    //     }
    //   }
    // );
  } catch (error) {
    throw new Error(error);
  }
  // console.log(`los tweets de socket=`, tweet);
  // TODO: Revisar esta parte del ejemplo, se puede filtrar los que son retweets:

  // Ignore RTs or self-sent tweets
  // const isARt = tweet.data.referenced_tweets?.some((tweet) => tweet.type === 'retweeted') ?? false;
  // if (isARt || tweet.data.author_id === meAsUser.id_str) {
  //   return;
  // }
  // });
  // });
});

mc.on('error', (err) => {
  console.log(err);
});
