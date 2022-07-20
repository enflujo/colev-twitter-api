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
  const res = await fetch('http://localhost:3000/contar');
  let datos = await res.json();

  // Peticiones
  // function palabrasPeso() {
  // const normalizarTexto = (textoANormalizar) => {
  //   textoANormalizar
  //     .normalizer('NFD')
  //     .replace(/\p{Diacritic}/gu, '')
  //     .toLowerCase()
  //     .trim();
  // };
  // const palabrasARemover = ['al', 'el', 'lo', 'te', 'al', 'estas', 'es', 'q'];
  // const expresionRegular = new RegExp(`\\b${palabrasARemover.join('|')}\\b`, 'gi');
  // let ocurrencias = {};
  // const palabrasGuardadas = [];
  // datos.forEach((llave) => {
  //   const cadaLlaveTexto = llave.text;
  //   // const textoNormalizado = normalizarTexto(cadaLlaveTexto);
  //   const palabras = cadaLlaveTexto.split(' ');
  //   const fecha = llave.created_at;

  //   palabras.forEach((palabra) => {
  //     const palabraI = palabrasGuardadas.findIndex((obj) => {
  //       return obj.palabra === palabra;
  //     });

  //     if (palabraI >= 0) {
  //       palabrasGuardadas[palabraI].fechas.push(fecha);
  //     } else {
  //       palabrasGuardadas.push({
  //         palabra: palabra,
  //         fechas: [fecha],
  //       });
  //     }
  //   });
  // console.log(palabrasGuardadas);

  //   let pesosPalabrasReconocidas = {};
  //   let palabrasReconocidas = [];
  //   palabras.forEach((cadaPalabra) => {
  //     const palabrasDesechadas = cadaPalabra.match(expresionRegular, palabras);
  //     if (pesosPalabrasReconocidas[palabras[cadaPalabra]] === undefined) {
  //       pesosPalabrasReconocidas[palabras[cadaPalabra]] = 1;
  //     } else {
  //       palabrasReconocidas[palabras[cadaPalabra]]++;
  //     }
  //     if (palabrasDesechadas === null) {
  //       palabrasReconocidas.push([
  //         {
  //           palabraReconocida: cadaPalabra,
  //           fecha: [fecha],
  //           peso: palabrasReconocidas[palabras[cadaPalabra]],
  //         },
  //       ]);
  //     }
  //     console.log(`cada palabra`, palabrasDesechadas, `palabras reconocidas`, palabrasReconocidas);
  //   });
  // });

  //   console.log(palabrasGuardadas);
  // }

  // palabrasPeso();

  // const categoriasDetectadas = Object.keys(apariciones);
  //   if (!listaCreadaCategorias.some((instancia) => instancia.prediccion === prediccion)) {
  //     listaCreadaCategorias.push({
  //       categoriasDetectadas,
  //     });
  //   }

  // function detector(prediccion) {
  //   if (!apariciones.hasOwnProperty(prediccion.class)) {
  //     const nombreCategoria = prediccion.class;
  //     apariciones[nombreCategoria] = [];
  //     const elemento = document.createElement('div');
  //     elemento.className = 'categoria';
  //     elemento.innerText = nombreCategoria;
  //     listaCategorias.appendChild(elemento);
  //     elemento.onclick = () => {
  //       console.log(`Apariciones de categoría ${prediccion.class}`, apariciones[nombreCategoria]);
  //     };
  //   }

  //   apariciones[prediccion.class].push({
  //     tiempo: video.currentTime,
  //     area: prediccion.bbox,
  //     confianza: prediccion.score,
  //   });
  // }

  //   const cadaLlaveFecha = llave.created_at;
  //   objetoTexto.push({
  //     textoCrudo: cadaLlaveTexto,
  //     fecha: cadaLlaveFecha,
  //   });
  // });
  // const campoTextoLimpio = [];
  // objetoTexto.forEach((texto) => {
  //   const cadaTextoLimpio = texto.textoCrudo.replace(expresionRegular, ' ');
  //   campoTextoLimpio.push({
  //     textoLimpio: cadaTextoLimpio,
  //     fecha: texto.fecha,
  //   });

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
  }
}

// Socket para llamar datos directamente del stream

socket.on('connect', () => {
  console.log('Connected to server...');
});

socket.on('tweet', (tweet) => {
  const tweetData = {
    // id: tweet.data.id,
    // conversation_id: tweet.data.conversation_id,
    // referenced_tweets: [
    //   {
    //     id: referenced_tweets.id,
    //     type: referenced_tweets.type,
    //   },
    // ],
    // author_id: tweet.data.author_id,
    // in_reply_to_user_id: tweet.data.in_reply_to_user_id,
    // retweeted_user_id: tweet.data.retweeted_user_id,
    // quoted_user_id: tweet.data.quoted_user_id,
    // created_at: tweet.data.created_at,
    // text: tweet.data.text,
    // lang: tweet.data.lang,
    // source: tweet.data.source,
    // public_metrics: tweet.data.public_metrics,
    // 'public_metrics.like_count': tweet.data.public_metrics.like_count,
    // 'public_metrics.quote_count': tweet.data.public_metrics.quote_count,
    // 'public_metrics.reply_count': tweet.data.public_metrics.reply_count,
    // 'public_metrics.retweet_count': tweet.data.public_metrics.retweet_count,
    // reply_settings: tweet.data.reply_settings,
    // withheld: tweet.data.withheld,
    // 'entities.annotations': tweet.data.entities.annotations,
    // 'entities.annotations': tweet.data.entities.annotations,
    // 'entities.hashtags': tweet.data.entities.hashtags,
    // 'entities.mentions': tweet.data.entities.mentions,
    // 'entities.urls': tweet.data.entities.urls,
    // context_annotations: tweet.data.context_annotations,
    /**
     * if (tweet.includes.media) {
     *   image = tweet.includes.media[0].url
     * } else {
     *   image = null
     * }
     */
    // 'attachments.media': tweet.includes.media ? tweet.includes.media[0].url : null,
    // 'attachments.media_keys': tweet.data.attachments.media_keys,
    // 'author.id': tweet.includes.users[0].id,
    // 'author.created_at': tweet.includes.users[0].created_at,
    // 'author.username': `@${tweet.includes.users[0].username}`,
    // 'author.name': tweet.includes.users[0].name,
    // 'author.description': tweet.includes.users[0].description ? tweet.includes.users[0].description : null,
    // 'author.entities.description.cashtags': tweet.includes.users
    //   ? tweet.includes.users[0].entities.description.cashtags[0]
    //   : null,
    // 'author.entities.description.hashtags': tweet.includes.users
    // ? tweet.includes.users[0].entities.description.hashtags[0]
    // : null,
    // 'author.entities.description.mentions': tweet.includes.users[0].entities.description.mentions[0]
    //   ? tweet.includes.users[0].entities.description.mentions[0]
    //   : null,
    // 'author.entities.description.urls': tweet.includes.users[0].entities.description.urls[0]
    //   ? tweet.includes.users[0].entities.description.urls[0]
    //   : null,
    // 'author.entities.url.urls': tweet.includes.users[0].entities.url.urls[0]
    //   ? tweet.includes.users[0].entities.url.urls[0]
    //   : null,
    // 'author.location': tweet.includes.users[0].location,
    // 'author.pinned_tweet_id': tweet.includes.users[0].pinned_tweet_id,
    // 'author.profile_image_url': tweet.includes.users[0].profile_image_url,
    // 'author.protected': tweet.includes.users[0].protected,
    // 'author.public_metrics.followers_count': tweet.includes.users[0].public_metrics.followers_count,
    // 'author.public_metrics.following_count': tweet.includes.users[0].public_metrics.following_count,
    // 'author.public_metrics.listed_count': tweet.includes.users[0].public_metrics.listed_count,
    // 'author.public_metrics.tweet_count': tweet.includes.users[0].public_metrics.tweet_count,
    // 'author.url': tweet.includes.users[0].url,
    // 'author.verified': tweet.includes.users[0].verified,
    // 'geo.coordinates.coordinates': tweet.includes.places[0].bbox,
    // 'geo.coordinates.type': tweet.includes.places[0].type,
    // 'geo.country': tweet.includes.places[0].country,
    // 'geo.country_code': tweet.includes.places[0].country_code,
    // 'geo.full_name': tweet.includes.places[0].full_name,
    // 'geo.geo.bbox': tweet.includes.places[0].geo.bbox,
    // 'geo.geo.type': tweet.includes.places[0].geo.type,
    // 'geo.id': tweet.includes.places[0].id,
    // 'geo.name': tweet.includes.places[0].name,
    // 'geo.place_id': tweet.data.geo.place_id,
    // 'geo.place_type': tweet.includes.places[0].place_type,
  };
  console.log(`los tweet del socket desde el index=`, tweet);
  // tweetStream.className = 'card my-4';

  // if (tweetData.image) {
  //   tweetStream.innerHTML = `
  //     <div class='card-body'>
  //       <img src=${tweetData.image}>
  //     </div>`;
  // }
});

inicio();
