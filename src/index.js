import { io } from 'socket.io-client';
import { calculoMeses } from '../utilidades/ayuda-visualizaciones.js';
import './scss/estilos.scss';

const tweetStream = document.getElementById('tweetStream');
const socket = io();
const tweets = [];
const canvas = document.getElementById('lienzo');
const ctx = canvas.getContext('2d');
const canvas2 = document.getElementById('lienzo2');
const ctx2 = canvas2.getContext('2d');
// const duracionHoras = calcularHoras(fechaInicial);
// const pasoNumeroTweets = 50;
// const baseFigura = canvas.heigth - canvas.heigth / 5;
// let margenIzquierda = 100;
// const pasohoras = (lienzo.width / tiempohoras) | 0;
// const proporcionBase = 4;
let fechaInicio;
let fechaSiguiente;
let diferenciaEnMs;
let fechaUltima;
let tiemposTotalDias;
let dimensionesCuadricula = 20;
async function inicio() {
  const respuesta = await fetch('./datos/covid19Parte.json');
  let datos = await respuesta.json();
  console.log(datos);
  datos = datos
    .map((tweet) => {
      tweet.created_at = new Date(tweet.created_at);
      return tweet;
    })
    .sort((a, b) => (a.created_at > b.created_at ? 1 : -1));

  const tiempos = [];
  console.log(tiempos);

  datos.forEach((tweet, i) => {
    if (i < datos.length - 1) {
      fechaInicio = tweet.created_at;
      fechaSiguiente = datos[i + 1].created_at;
      diferenciaEnMs = fechaSiguiente - fechaInicio;
      fechaUltima = tweet.created_at[98];
      const diferenciaEnSeg = diferenciaEnMs / 1000;
      console.log(`diferencia segundos ${diferenciaEnSeg}`);
      tiempos.push({ i: i, ms: diferenciaEnMs });
      // console.log(`Del ${i} al ${i + 1} la diferencia es de:`, diferenciaEnSeg);
    }
  });

  let primerTiempo;
  let ultimoTiempo;
  tiempos.forEach((tiempo) => {
    primerTiempo = tiempos[0].ms;
    ultimoTiempo = tiempos[tiempos.length - 1].ms;
  });

  const tiempoTotalMS = ultimoTiempo - primerTiempo;
  const tiemposTotalSG = tiempoTotalMS / 1000;
  const tiemposTotalMN = tiemposTotalSG / 60;
  const tiemposTotalHoras = tiemposTotalMN / 60;
  tiemposTotalDias = Math.floor(tiemposTotalHoras / 24);
  dimensionesCuadricula = Math.floor(canvas.width / tiemposTotalDias);
  console.log(`dimensiones cuadricula = ${dimensionesCuadricula}`);

  let tweetI = 0;
  // const elem = document.querySelector('.jsonData');

  function imprimir() {
    // elem.innerHTML = datos[tweetI].created_at.getMonth();
    tweetI++;
    buscarTweet();
    pintarCirculos();
  }
  function buscarTweet() {
    setTimeout(() => {
      imprimir();
    }, tiempos[tweetI].ms / 1000);
  }
  function pintarCirculos() {
    const X = tweetI * dimensionesCuadricula + dimensionesCuadricula * 2;
    console.log(`este es X=${X} y este es tweetI ${tweetI}`);
    const Y = canvas2.height / 2;
    const radius = 5;
    ctx2.lineWidth = 3;
    ctx2.strokeStyle = '#FF0000';
    ctx2.beginPath();
    ctx2.arc(X, Y, radius, 0, 2 * Math.PI, false);
    ctx2.stroke();
  }
  imprimir();
  buscarTweet();
  crearCoordenadas();
}
inicio();

function actualizar() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas2.width = window.innerWidth;
  canvas2.height = window.innerHeight;
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

let baseEjeX = Math.floor(canvas.height / dimensionesCuadricula) - 5;
let baseEjeY = 2;
let puntoInicioEjeX = { number: 1, suffix: '\u03a0' };
let puntoInicioEjeY = { number: 1, suffix: '' };

let numeroLineasEjeX = Math.floor(canvas.height / dimensionesCuadricula);
let numeroLineasEjeY = Math.floor(canvas.width / dimensionesCuadricula);

function crearCoordenadas() {
  // Pinta las lineas de la reja en el eje X
  for (let i = 0; i <= tiemposTotalDias; i++) {
    ctx.beginPath();
    ctx.lineWidth = 1;

    // Si la línea encaja con el resultado se pinta de otro color
    if (i == baseEjeX) {
      ctx.strokeStyle = '#000000';
    } else {
      ctx.strokeStyle = '#e9e9e9';
    }

    if (i == tiemposTotalDias) {
      ctx.moveTo(0, dimensionesCuadricula * i);
      ctx.lineTo(canvas.width, dimensionesCuadricula * i);
    } else {
      ctx.moveTo(0, dimensionesCuadricula * i + 0.5);
      ctx.lineTo(canvas.width, dimensionesCuadricula * i + 0.5);
    }
    ctx.stroke();
  }

  // Pinta las lineas de la reja en el eje Y
  for (let i = 0; i <= numeroLineasEjeY; i++) {
    ctx.beginPath();
    ctx.lineWidth = 1;

    // Si la línea encaja con el resultado se pinta de otro color
    if (i == baseEjeY) {
      ctx.strokeStyle = '#000000';
    } else {
      ctx.strokeStyle = '#e9e9e9';
    }

    if (i == numeroLineasEjeY) {
      ctx.moveTo(dimensionesCuadricula * i, 0);
      ctx.lineTo(dimensionesCuadricula * i, canvas.height);
    } else {
      ctx.moveTo(dimensionesCuadricula * i + 0.5, 0);
      ctx.lineTo(dimensionesCuadricula * i + 0.5, canvas.height);
    }
    ctx.stroke();
  }

  // Trasladar a un nuevo origen el eje X y el eje Y.  En este punto el eje Y del canvas es opuesto al eje Y de la grágica. Así, la coordenada y de cada elemento será negativo respecto al actual.
  ctx.translate(baseEjeY * dimensionesCuadricula, baseEjeX * dimensionesCuadricula);

  // Marcas de verificación a lo largo del eje positivo X
  for (let i = 1; i < numeroLineasEjeY - baseEjeY; i++) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000000';

    // Pintar una marca de verificación de 6x de largo (de -3 a 3)
    ctx.moveTo(dimensionesCuadricula * i + 0.5, -3);
    ctx.lineTo(dimensionesCuadricula * i + 0.5, 3);
    ctx.stroke();

    // El valor del texto en este punto
    ctx.font = '9px Arial';
    ctx.textAlign = 'start';
    ctx.fillText(puntoInicioEjeX.number * i + puntoInicioEjeX.suffix, dimensionesCuadricula * i - 2, 15);
  }

  // Marcas de verificación a lo largo del eje negativo X
  for (let i = 1; i < baseEjeY; i++) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000000';

    // Pintar una marca de verificación de 6x de largo (de -3 a 3)
    ctx.moveTo(-dimensionesCuadricula * i + 0.5, -3);
    ctx.lineTo(-dimensionesCuadricula * i + 0.5, 3);
    ctx.stroke();

    // El valor del texto en este punto
    ctx.font = '9px Arial';
    ctx.textAlign = 'end';
    ctx.fillText(-puntoInicioEjeX.number * i + puntoInicioEjeX.suffix, -dimensionesCuadricula * i + 3, 15);
  }

  // Marcas de verificación a lo largo del eje positivo Y
  // El eje positivo Y de la gráfica es el eje negativo Y del canvas
  for (let i = 1; i < tiemposTotalDias - baseEjeX; i++) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000000';

    // Pintar una marca de verificación de 6x de largo (de -3 a 3)
    ctx.moveTo(-3, dimensionesCuadricula * i + 0.5);
    ctx.lineTo(3, dimensionesCuadricula * i + 0.5);
    ctx.stroke();

    // El valor del texto en este punto
    ctx.font = '9px Arial';
    ctx.textAlign = 'start';
    ctx.fillText(-puntoInicioEjeY.number * i + puntoInicioEjeY.suffix, 8, dimensionesCuadricula * i + 3);
  }

  // Marcas de verificación a lo largo del eje negativo Y
  // El eje negativo Y de la gráfica es el eje positivo Y del lienzo
  for (let i = 1; i < baseEjeX; i++) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000000';

    // Pintar una marca de verificación de 6x de largo (de -3 a 3)
    ctx.moveTo(-3, -dimensionesCuadricula * i + 0.5);
    ctx.lineTo(3, -dimensionesCuadricula * i + 0.5);
    ctx.stroke();

    // El valor del texto en este punto
    ctx.font = '9px Arial';
    ctx.textAlign = 'start';
    ctx.fillText(puntoInicioEjeY.number * i + puntoInicioEjeY.suffix, 8, -dimensionesCuadricula * i + 3);
  }
}
