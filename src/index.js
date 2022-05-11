import { io } from 'socket.io-client';
import './scss/estilos.scss';
// function constrain(n, low, high) {
//   return Math.max(Math.min(n, high), low);
// }
// function map(n, start1, stop1, start2, stop2, withinBounds) {
//   const newval = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
//   if (!withinBounds) {
//     return newval;
//   }
//   if (start2 < stop2) {
//     return constrain(newval, start2, stop2);
//   } else {
//     return constrain(newval, stop2, start2);
//   }
// }

const tweetStream = document.getElementById('tweetStream');
const socket = io();
const tweets = [];
const canvas = document.getElementById('lienzo');
const ctx = canvas.getContext('2d');
const canvas2 = document.getElementById('lienzo2');
const ctx2 = canvas2.getContext('2d');
let fechaInicio;
let fechaSiguiente;
let fechaFinal;
let diferenciaEnMs;
let diferenciaTotal;
let escalaMs;
let escalaHoras;
let escalaDias;
let totalDias;
let totalMeses;
let totalHoras;
let escalaNumTweets;
const margen = { arriba: 100, abajo: 200, derecha: 300, izquierda: 300 };
const espacioMargen = 15.5;

//Función asincrónica, ya que los datos pueden demorarse en llegar. Esta función tare los datos por medio del fetch y los convierte en JSON
async function inicio() {
  const res = await fetch('http://localhost:3000/prueba');
  let datos = await res.json();

  // const respuesta = await fetch('./datos/covid19Parte.json');
  // let datos = await respuesta.json();

  datos = datos //Con esta función map() se revisan cada uno de los datos (o tweets) en el campo created_at de cada tweet para convertirlo a un formato de fecha en Javascript
    .map((tweet) => {
      tweet.created_at = new Date(tweet.created_at);
      return tweet;
    })
    .sort((a, b) => (a.created_at > b.created_at ? 1 : -1)); // Esta función sort() organiza todos los tweets por fecha, desde el primero creado hasta el último

  fechaInicio = datos[0].created_at;
  fechaFinal = datos[datos.length - 1].created_at;
  diferenciaTotal = fechaFinal - fechaInicio;
  totalDias = Math.ceil(diferenciaTotal / (1000 * 60 * 60 * 24));
  totalHoras = Math.ceil(totalDias * 24);
  totalMeses = Math.ceil(totalDias / 12);

  console.log(totalDias, totalMeses, totalHoras);

  const datosAgregadosPorDia = [];
  let yMax = 0;

  datos.forEach((d) => {
    const fechaParaRevisar = d.created_at.toLocaleString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });

    let datosAgregadosI = datosAgregadosPorDia.findIndex((objetoDia) => objetoDia.fecha === fechaParaRevisar);

    if (datosAgregadosI < 0) {
      datosAgregadosPorDia.push({
        fecha: fechaParaRevisar,
        total: 0,
        tweets: [],
      });

      datosAgregadosI = datosAgregadosPorDia.length - 1;
    }

    const instanciaDia = datosAgregadosPorDia[datosAgregadosI];
    instanciaDia.total++;
    if (instanciaDia.total > yMax) {
      yMax = instanciaDia.total;
    }
    instanciaDia.tweets.push(d);
  });

  console.log(datosAgregadosPorDia, 'ymax=', yMax);

  const tiempos = [];
  let fechaActual;
  datos.forEach((tweet, i) => {
    //Esta función forEach() pasa por cada uno de los datos para obtener la fecha de inicio de la visualización, así como la fecha siguiente y la fecha final. Los datos que se obtienen en estas variables están en milisegundos.
    if (i < datos.length - 1) {
      fechaActual = tweet.created_at;
      fechaSiguiente = datos[i + 1].created_at;
      diferenciaEnMs = fechaSiguiente - fechaActual;
      tiempos.push({ i: i, ms: diferenciaEnMs });
    }
  });

  // diferenciaEnDias = Math.floor(diferenciaTotal / (1000 * 3600 * 24));
  // diferenciaEnMeses = Math.floor(diferenciaTotal / (1000 * 3600 * 24));
  console.log(datos);
  window.onresize = actualizar;
  actualizar(yMax);

  // dimensionesCuadriculaDias = Math.floor(canvas.width / diferenciaEnDias); //Dimensiones necesarias para saber la distancia entre cada una de las líneas de la malla según la cantidad de días que abarcan los datos.
  // dimensionesCuadriculaMeses = Math.floor(canvas.width / diferenciaEnMeses);

  crearCoordenadas(yMax);

  let tweetI = 0; //Contador para pasar por cada tweet
  //Esta función se repite cada cierto tiempo, definido en setTimeOut(), imprimiendo los círculos en la pantalla.
  function imprimir() {
    // elem.innerHTML = datos[tweetI].created_at.getMonth();
    pintarCirculos(datosAgregadosPorDia);

    // actualizar al siguiente twit
    if (tweetI <= datos.length - 1) {
      tweetI++;
      buscarTweet();
    }
  }

  //Esta función permite determinar el tiempo en el que cada círculo debe ser impreso en la pantalla. La idea es simular, en un tiempo reducido, la aparición de cada tweet en tiempo real según las fecha de publicación en cada tweet indicado en el valor de created_at
  function buscarTweet() {
    setTimeout(() => {
      imprimir();
    }, tiempos[tweetI].ms / 1000);
  }

  //Esta función pinta cada uno de los círculos que van apareciendo en la pantalla por medio de la función imprimir().
  function pintarCirculos(datosAgregadosPorDia) {
    for (let i = 0; i <= totalDias; i++) {
      let tweetsPorDia = datosAgregadosPorDia[i].total;
      let y = canvas.height - espacioMargen - tweetsPorDia * escalaNumTweets;
      const x = canvas.width - canvas.width + espacioMargen + escalaDias * i + escalaDias;
      const radius = 5; //El tamaño de los círculos que van a ser pintados
      ctx2.lineWidth = 3; //El grosor de la línea de cada círculo
      ctx2.strokeStyle = '#FF0000'; //El color de la línea de cada círculo
      ctx2.beginPath();
      ctx2.arc(x, y, radius, 0, 2 * Math.PI, false);
      ctx2.stroke();
    }
    // const X = canvas.width / diferenciaTotal * ; //este valor determina la ubicación en el eje X de cada círculo. Según esto, el eje X está determinado por el index del tweet llamado por medio de TweetI, multiplicado por el espacio de cada línea de la malla según la cantidad de días que se van a visualizar. La última parte, donde se tiene en cuenta el espacio entre líneas según los días, multiplicado por 2 para que los círculos empiecen dentro de las coordenadas
  }
  imprimir();
  buscarTweet();
}

function actualizar(yMax) {
  //Determina el tamaño de cada lienzo según la pantalla donde se está visualizando
  canvas.width = canvas2.width = window.innerWidth - margen.izquierda - margen.derecha;
  canvas.height = canvas2.height = window.innerHeight - margen.arriba - margen.abajo;
  canvas.style.left = canvas2.style.left = `${margen.izquierda}px`;
  canvas.style.top = canvas2.style.top = `${margen.arriba}px`;

  const baseEscalaX = canvas.width - espacioMargen;
  const baseEscalaY = canvas.height - espacioMargen;
  escalaMs = baseEscalaX / diferenciaTotal;
  escalaHoras = baseEscalaX / totalHoras;
  escalaDias = baseEscalaX / totalDias;
  escalaNumTweets = baseEscalaY / yMax;
  ctx.lineWidth = 1;
}

//Visualizacion

//////////////
//////////////////
/////////////////////////// Sistema de coordenadas
function crearCoordenadas(yMax) {
  ctx.beginPath();
  ctx.moveTo(0, canvas.height - espacioMargen);
  ctx.lineTo(canvas.width, canvas.height - espacioMargen);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(espacioMargen, 0);
  ctx.lineTo(espacioMargen, canvas.height);
  ctx.stroke();

  for (let i = 0; i <= totalDias; i++) {
    let x = ((escalaDias * i) | 0) + espacioMargen;
    const y = canvas.height - 10 - espacioMargen;

    if (i === totalDias) {
      // x = x - espacioMargen;
    }
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + 20 + espacioMargen);
    ctx.stroke();
  }

  for (let i = 0; i <= totalHoras; i++) {
    let x = ((escalaHoras * i) | 0) + espacioMargen;
    const y = canvas.height - 5 - espacioMargen;

    if (i !== totalHoras) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + 10);
      ctx.stroke();
    }
  }
  for (let i = 0; i <= yMax; i++) {
    const x = espacioMargen - 10;
    let y = canvas.height - (((escalaNumTweets * i) | 0) + espacioMargen);

    if (i !== yMax) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 20, y);
      ctx.stroke();
    }

    console.log('escala tweets=', escalaNumTweets, canvas.height);
  }

  // Pinta las lineas de la reja en el eje X
  // const fechaFinal = datos[datos.length - 1].created_at;
  // const fechaUno = datos[0].created_at;
  // const escalaHoras = escala * 1000 * 60 * 60;
  // const baseEjeX = Math.floor(canvas.height / escala) - 5; //Determina la posición de la línea central del sistema de coordenadas en el eje X
  // // const fechaNueva = fechaFinal - tweet.created_at;
  // // const x = fechaNueva * escala;
  // console.log(`diferencia total en ms = ${diferenciaTotal}, escala ${escala}, escala horas = ${escalaHoras}`);
  // for (let i = 0; i <= escalaHoras; i++) {
  //   ctx.beginPath();
  //   ctx.lineWidth = 1;
  //   // Si la línea encaja con el resultado se pinta de otro color
  //   if (i == escalaHoras + 3) {
  //     ctx.strokeStyle = '#000000';
  //   } else {
  //     ctx.strokeStyle = '#e9e9e9';
  //   }
  //   if (i == escalaHoras) {
  //     ctx.moveTo(0, escalaHoras * i);
  //     ctx.lineTo(canvas.width, escalaHoras * i);
  //   } else {
  //     ctx.moveTo(0, escalaHoras * i + 0.5);
  //     ctx.lineTo(canvas.width, escalaHoras * i + 0.5);
  //   }
  //   ctx.stroke();
  // }
  // numeroLineasEjeX = Math.floor(canvas.height / dimensionesCuadriculaDias);
  // numeroLineasEjeY = Math.floor(canvas.width / escalaHoras);
  // // Pinta las lineas de la reja en el eje Y
  // for (let i = 0; i <= escalaHoras; i++) {
  //   ctx.beginPath();
  //   ctx.lineWidth = 1;
  //   // Si la línea encaja con el resultado se pinta de otro color
  //   if (i == escalaHoras + 1) {
  //     ctx.strokeStyle = '#000000';
  //   } else {
  //     ctx.strokeStyle = '#e9e9e9';
  //   }
  //   if (i == escalaHoras) {
  //     ctx.moveTo(escalaHoras * i, 0);
  //     ctx.lineTo(escalaHoras * i, canvas.height);
  //   } else {
  //     ctx.moveTo(escalaHoras * i + 0.5, 0);
  //     ctx.lineTo(escalaHoras * i + 0.5, canvas.height);
  //   }
  //   ctx.stroke();
  // }
  // // Trasladar a un nuevo origen el eje X y el eje Y.  En este punto el eje Y del canvas es opuesto al eje Y de la gráfica. Así, la coordenada Y de cada elemento será negativo respecto al actual.
  // ctx.translate(baseEjeY * dimensionesCuadriculaDias, baseEjeX * dimensionesCuadriculaDias);
  // const fecha = new Date(fechaInicio);
  // let fechaActual = fecha;
  // // Marcas de verificación a lo largo del eje positivo X
  // for (let i = 0; i < diferenciaEnDias; i++) {
  //   ctx.beginPath();
  //   ctx.lineWidth = 1;
  //   const diaActual = fecha.setDate(fecha.getDate() + 1);
  //   // Pintar una marca de verificación de 6x de largo (de -3 a 3)
  //   if (new Date(diaActual).getDate() === 1) {
  //     ctx.lineWidth = 5;
  //     ctx.strokeStyle = '#ff0000';
  //     ctx.moveTo(dimensionesCuadriculaDias * i + 0.5, -10);
  //     ctx.lineTo(dimensionesCuadriculaDias * i + 0.5, 10);
  //     ctx.stroke();
  //     let fechaLetras = fecha.toLocaleDateString('es-CO', {
  //       month: 'long',
  //     });
  //     console.log(`letras mes = ${fechaLetras}`);
  //     // El valor del texto en este punto
  //     ctx.font = '9px Arial';
  //     ctx.textAlign = 'start';
  //     ctx.fillText(fechaLetras, dimensionesCuadriculaDias * i, 15);
  //   } else {
  //     ctx.strokeStyle = '#000000';
  //     ctx.moveTo(dimensionesCuadriculaDias * i + 0.5, -3);
  //     ctx.lineTo(dimensionesCuadriculaDias * i + 0.5, 3);
  //     ctx.stroke();
  //   }
  // }
  // // Marcas de verificación a lo largo del eje negativo X
  // for (let i = 1; i < baseEjeY; i++) {
  //   ctx.beginPath();
  //   ctx.lineWidth = 1;
  //   ctx.strokeStyle = '#000000';
  //   // Pintar una marca de verificación de 6x de largo (de -3 a 3)
  //   ctx.moveTo(-dimensionesCuadriculaDias * i + 0.5, -3);
  //   ctx.lineTo(-dimensionesCuadriculaDias * i + 0.5, 3);
  //   ctx.stroke();
  //   // El valor del texto en este punto
  //   ctx.font = '9px Arial';
  //   ctx.textAlign = 'end';
  //   ctx.fillText(-puntoInicioEjeX.number * i + puntoInicioEjeX.suffix, -dimensionesCuadriculaDias * i + 3, 15);
  // }
  // // Marcas de verificación a lo largo del eje positivo Y
  // // El eje positivo Y de la gráfica es el eje negativo Y del canvas
  // for (let i = 1; i < diferenciaEnMeses; i++) {
  //   ctx.beginPath();
  //   ctx.lineWidth = 1;
  //   ctx.strokeStyle = '#ff0000';
  //   // Pintar una marca de verificación de 6x de largo (de -3 a 3)
  //   ctx.moveTo(-3, dimensionesCuadriculaMeses * i + 0.5);
  //   ctx.lineTo(3, dimensionesCuadriculaMeses * i + 0.5);
  //   ctx.stroke();
  //   // El valor del texto en este punto
  //   ctx.font = '9px Arial';
  //   ctx.textAlign = 'start';
  //   ctx.fillText(-puntoInicioEjeY.number * i + puntoInicioEjeY.suffix, 8, dimensionesCuadriculaMeses * i + 3);
  // }
  // // Marcas de verificación a lo largo del eje negativo Y
  // // El eje negativo Y de la gráfica es el eje positivo Y del lienzo
  // for (let i = 1; i < baseEjeX; i++) {
  //   ctx.beginPath();
  //   ctx.lineWidth = 1;
  //   ctx.strokeStyle = '#000000';
  //   // Pintar una marca de verificación de 6x de largo (de -3 a 3)
  //   ctx.moveTo(-3, -dimensionesCuadriculaDias * i + 0.5);
  //   ctx.lineTo(3, -dimensionesCuadriculaDias * i + 0.5);
  //   ctx.stroke();
  //   // El valor del texto en este punto
  //   ctx.font = '9px Arial';
  //   ctx.textAlign = 'start';
  //   ctx.fillText(puntoInicioEjeY.number * i + puntoInicioEjeY.suffix, 8, -dimensionesCuadriculaDias * i + 3);
  // }
}

// Socket para llamar datos directamente del stream

// socket.on('connect', () => {
//   console.log('Connected to server...');
// });

// socket.on('tweet', (tweet) => {
//   const tweetData = {
//     id: tweet.data.id,
// conversation_id: tweet.data.conversation_id
// referenced_tweets: tweet.data.referenced_tweets
// author_id: tweet.data.author_id
// in_reply_to_user_id: tweet.data.in_reply_to_user_id
// retweeted_user_id: tweet.data.retweeted_user_id
// quoted_user_id: tweet.data.quoted_user_id
// created_at: tweet.data.created_at
//     text: tweet.data.text,
// lang: tweet.data.lang
// source: tweet.data.source
// public_metrics: tweet.data.public_metrics
// reply_settings: tweet.data.reply_settings
// withheld: tweet.data.withheld
// entities: tweet.entities
// context_annotations: tweet.data.context_annotations
// attachments: tweet.attachments
// author: tweet.author
// geo: tweet.geo

//     username: `@${tweet.includes.users[0].username}`,
//     image: tweet.includes.media ? tweet.includes.media[0].url : null,
//     likes: tweet.data.public_metrics.like_count,
//     retweet: tweet.data.public_metrics.retweet_count,
//     reply: tweet.data.public_metrics.reply_count,
//     quote: tweet.data.public_metrics.quote_count,
//   };

// tweetStream.className = 'card my-4';

// if (tweetData.image) {
//   tweetStream.innerHTML = `
//       <div class='card-body'>
//         <img src=${tweetData.image}>
//       </div>`;
// }
// });

inicio();
