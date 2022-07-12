import 'dotenv/config';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import http from 'http';
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import palabrasClaves from './modelos/palabrasClaves.js';
import camposBusqueda from './modelos/camposBusqueda.js';
import axios from 'axios';
import contarTweets from './modulos/contarTweets.js';
import { conectar } from './modulos/baseDeDatos.js';
import historicos from './modulos/historicos.js';
import { cadena, chulo, logAviso, logCyan, logVerde, PUERTO } from './utilidades/constantes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('dist'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'dist', 'index.html'));
});

server.listen(PUERTO, () => {
  console.log(`${cadena} ${logCyan('Servidor disponible en:')} ${logAviso.underline(`http://localhost:${PUERTO}`)}`);
  inicio();
});

app.get('/prueba', async (req, res) => {
  // tendencias();
  // const todos = await coleccionTweets.find({});
  // res.send(todos);
});

io.on('connection', async () => {
  console.log('Client connected...');
});

////////////////////////REST API

async function inicio() {
  await conectar();

  // const totalTweets = await contarTweets();
  // console.log(`${chulo} ${logVerde('Total de tweets actualmente es de:')} ${logVerde(totalTweets)}`);
  // activarFlujo();
  await historicos();
}
