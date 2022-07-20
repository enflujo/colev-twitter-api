import 'dotenv/config';
import fastify from 'fastify';
import cors from '@fastify/cors';

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import http from 'http';
import express from 'express';

import { Server } from 'socket.io';
import contarTweets from './modulos/contarTweets.js';
import { conectar } from './modulos/baseDeDatos.js';
import historicos from './modulos/historicos.js';
import {
  cadena,
  chulo,
  logAviso,
  logCyan,
  logVerde,
  PUERTO,
  fechaInicial,
  fechaFinal,
} from './utilidades/constantes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
console.log(process.env.NODE_ENV);
const servidor = fastify({
  // logger: {
  //   transport:
  //     environment === 'development'
  //       ? {
  //           target: 'pino-pretty',
  //           options: {
  //             translateTime: 'HH:MM:ss Z',
  //             ignore: 'pid,hostname',
  //           },
  //         }
  //       : undefined,
  // },
});

servidor.register(cors);
// servidor.register(limpieza);

servidor.listen({ port: PUERTO }, async (error) => {
  if (error) {
    servidor.log.error(error);
    process.exit(1);
  }

  console.log(`${cadena} ${logCyan('Servidor disponible en:')} ${logAviso.underline(`http://localhost:${PUERTO}`)}`);
  await conectar();
});

servidor.get('/', async () => {
  return { enflujo: 'Ante el presente digital' };
});

servidor.get('/contar', async () => {
  const totalTweets = await contarTweets();
  console.log(`${chulo} ${logVerde('Total de tweets actualmente es de:')} ${logVerde(totalTweets)}`);
  return { totalTweets, fechaInicial, fechaFinal };
});

// app.use(express.static('dist'));

// app.get('/', (req, res) => {
//   res.sendFile(resolve(__dirname, 'dist', 'index.html'));
// });

// app.get('/prueba', async (req, res) => {
//   // tendencias();
//   // const todos = await coleccionTweets.find({});
//   // res.send(todos);
// });

// app.get('/contar', async (peticion, respuesta) => {

// });

// app.get('/historicos', async (peticion, respuesta) => {
//   // activarFlujo();
//   await historicos();
// });

// server.listen(PUERTO, () => {
//   console.log(`${cadena} ${logCyan('Servidor disponible en:')} ${logAviso.underline(`http://localhost:${PUERTO}`)}`);
//   inicio();
// });

// ////////////////////////REST API

// async function inicio() {
//   await conectar();
// }
