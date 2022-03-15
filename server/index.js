require('dotenv').config();
const mongoose = require('mongoose');
const { MONGO_USER, MONGO_PASS, TWITTER_BEARER_TOKEN: TOKEN } = process.env;
const MONGODB_URI = `mongodb://${MONGO_USER}:${MONGO_PASS}@localhost:27017`;
const mc = mongoose.connection;
const entradaSchema = require('../models/Tweet');
const http = require('http');
const path = require('path');
const express = require('express');
const socketIo = require('socket.io');
const needle = require('needle');
const Port = process.env.Port || 3000;
const palabrasClaves = require('../models/palabrasClaves');
const urlBusqueda = require('../models/camposBusqueda');
const query = palabrasClaves.covid19.join(' OR ').trim();
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
let collection = mongoose.model('Tweet', entradaSchema);

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

const rulesUrl = 'https://api.twitter.com/2/tweets/search/stream/rules';
const streamUrl = `https://api.twitter.com/2/tweets/search/stream?${urlBusqueda}`;

const rules = [{ value: query }];

//Get stream rules

async function getRules() {
  const response = await needle('get', rulesUrl, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return response.body;
}

//Set stream rules

async function setRules() {
  const data = {
    add: rules,
  };
  const response = await needle('post', rulesUrl, data, {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return response.body;
}

//Delete stream rules

async function deleteRules(rules) {
  if (!Array.isArray(rules.data)) {
    return null;
  }

  const ids = rules.data.map((rule) => rule.id);
  const data = {
    delete: {
      ids: ids,
    },
  };
  const response = await needle('post', rulesUrl, data, {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return response.body;
}

function streamTweets() {
  const stream = needle.get(streamUrl, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  stream.on('data', (data) => {
    try {
      const json = JSON.parse(data);
      io.emit('tweet', json);
      collection.insertMany(
        {
          text: json.data.text,
          author_id: json.data.author_id,
          id: json.data.id,
          conversation_id: json.data.conversation_id,
        },
        (err, result) => {
          if (err) console.log(err);
          if (result) {
            console.log('datos insertados');
          }
        }
      );
    } catch (error) {}
  });
}

io.on('connection', async () => {
  console.log('Client connected...');

  let currentRules;

  try {
    //Get all stream rules
    currentRules = await getRules();
    //delete all stream rules
    await deleteRules(currentRules);
    //Set rules based on array above
    await setRules();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  streamTweets();
});

server.listen(Port, () => console.log(`Listening on port ${Port}`));

/// DB connection

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mc.once('open', (req, res) => {
  console.log('database connected to', MONGODB_URI);
});

mc.on('error', (err) => {
  console.log(err);
});
