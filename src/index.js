import { io } from 'socket.io-client';
import { calculoMeses } from '../utilidades/ayuda-visualizaciones.js';
import './scss/estilos.scss';

const tweetStream = document.getElementById('tweetStream');
const socket = io();
const tweets = [];
const canvas = document.getElementById('lienzo');
const ctx = canvas.getContext('2d');
const pasoNumeroTweets = 50;
const baseFigura = canvas.heigth - canvas.heigth / 5;
let margenIzquierda = 100;
const pasohoras = (lienzo.width / tiempohoras) | 0;
const proporcionBase = 4;
let fechaInicial;
let fechaFinal;
let fechas = [];
const tiempohoras = fechaInicial - fechaFinal;

async function inicio() {
  const respuesta = await fetch('./datos/covid19Parte.json');
  let datos = await respuesta.json();
  datos = datos
    .map((tweet) => {
      tweet.created_at = new Date(tweet.created_at);
      fechas.push(tweet.created_at.getHours());
      return tweet;
    })
    .sort((a, b) => (a.created_at > b.created_at ? 1 : -1));

  const tiempos = [];

  datos.forEach((tweet, i) => {
    if (i < datos.length - 1) {
      const fechaInicio = tweet.created_at;
      const fechaSiguiente = datos[i + 1].created_at;
      const diferenciaEnMs = fechaSiguiente - fechaInicio;
      fechas.push(tweet.created_at.getHours());
      const diferenciaEnSeg = diferenciaEnMs / 1000;
      tiempos.push({ i: i, ms: diferenciaEnMs });
      // console.log(`Del ${i} al ${i + 1} la diferencia es de:`, diferenciaEnSeg);
    }
  });
  let tweetI = 0;
  const elem = document.querySelector('.jsonData');

  function imprimir() {
    // console.log(datos[tweetI]);
    // elem.innerHTML = datos[tweetI].created_at.getMonth();
    tweetI++;
    buscarTweet();
    pintarCirculos();
    console.log(`este es tweetI: ${tweetI}`);
    function pintarCirculos() {
      const X = canvas.width / tweetI;
      const Y = canvas.height / 2;
      const radius = 45;
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#FF0000';
      ctx.beginPath();
      ctx.arc(X, Y, radius, 0, 2 * Math.PI, false);
      ctx.stroke();
    }
  }
  function buscarTweet() {
    setTimeout(() => {
      imprimir();
    }, tiempos[tweetI].ms / 1000);
  }
  imprimir();
  buscarTweet();
}

inicio();

function actualizar() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.onresize = actualizar;
actualizar();

socket.on('connect', () => {
  console.log('Connected to server...');
});

socket.on('tweet', (tweet) => {
  // console.log(tweet);
  const tweetData = {
    id: tweet.data.id,
    text: tweet.data.text,
    username: `@${tweet.includes.users[0].username}`,
    image: tweet.includes.media ? tweet.includes.media[0].url : null,
    likes: tweet.data.public_metrics.like_count,
    retweet: tweet.data.public_metrics.retweet_count,
    reply: tweet.data.public_metrics.reply_count,
    quote: tweet.data.public_metrics.quote_count,
  };

  // tweetStream.className = 'card my-4';

  // if (tweetData.image) {
  //   tweetStream.innerHTML = `
  //       <div class='card-body'>
  //         <img src=${tweetData.image}>
  //       </div>`;
  // }
});

//Visualizacion

//// Sistema de coordenadas

// async function crearCoordenadas() {
//   pasoNumeroTweets;
//   console.log(`fechas = ${fechas}`);
//   fechaInicial = fechas[0];
//   console.log(`fecha inicial = ${fechaInicial}`);

//   fechaFinal = fechas[fechas.length - 1];
//   console.log(`fecha final = ${fechaFinal}`);

//   ctx.lineWidth = 1;
//   ctx.font = '25px Arial';
//   ctx.textAlign = 'start';
//   ctx.strokeStyle = '#e9e9e9';
//   ctx.fillStyle = '#ffffff';

//   //Eje X
//   for (let i = 0; i <= tiempohoras; i++) {
//     const x = pasoMes * i + margenIzquierda;
//     const mes = (inicio.getMonth() + i) % 15;

//     ctx.beginPath();
//     ctx.moveTo(x, 0);
//     ctx.lineTo(x, baseFigura);
//     ctx.stroke();
//     ctx.fillText(mesATexto(mes), x - 15, baseTexto);
//   }

//   //Eje Y
//   for (let i = 0; i <= pasoNumeroTweets * 4; i += pasoNumeroTweets) {
//     const y = baseFigura - i * proporcionBase;
//     ctx.beginPath();
//     ctx.moveTo(margenIzquierda, y);
//     ctx.lineTo(lienzo.width, y);
//     ctx.stroke();
//     ctx.fillText(i, margenIzquierda - 50, y + 8);
//   }
// }
