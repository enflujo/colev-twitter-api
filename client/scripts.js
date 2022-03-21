import { calculoMeses } from './utilidades/ayuda-visualizaciones';

// function calculoMeses(inicio, final) {
//   let meses = final.getMonth() - inicio.getMonth();
//   meses -= inicio.getMonth();
//   meses += final.getMonth();
//   return meses <= 0 ? 0 : meses;
// }
const tweetStream = document.getElementById('tweetStream');
const socket = io();
const tweets = [];
const lienzo = document.getElementById('lienzo');
const ctx = lienzo.getContext('2d');

async function inicio() {
  const respuesta = await fetch('./covid19Parte.json');
  let datos = await respuesta.json();
  datos = datos
    .map((tweet) => {
      tweet.created_at = new Date(tweet.created_at);
      return tweet;
    })
    .sort((a, b) => (a.created_at > b.created_at ? 1 : -1));

  const tiempos = [];

  datos.forEach((tweet, i) => {
    if (i < datos.length - 1) {
      const fechaInicio = tweet.created_at;
      const fechaSiguiente = datos[i + 1].created_at;
      const diferenciaEnMs = fechaSiguiente - fechaInicio;
      const diferenciaEnSeg = diferenciaEnMs / 1000;
      tiempos.push({ i: i, ms: diferenciaEnMs });
      // console.log(`Del ${i} al ${i + 1} la diferencia es de:`, diferenciaEnSeg);
    }
  });
  let tweetI = 0;
  const elem = document.querySelector('.jsonData');

  function imprimir() {
    // console.log(datos[tweetI]);
    elem.innerHTML = datos[tweetI].created_at.getMonth();
    tweetI++;
    buscarTweet();
  }
  function buscarTweet() {
    setTimeout(() => {
      imprimir();
      buscarTweet();
    }, tiempos[tweetI].ms / 1000);
  }
  imprimir();
  crearCoordenadas();
}
dimensionPantalla();
inicio();

//Lienzo
function dimensionPantalla() {
  lienzo.width = window.innerWidth / 2;
  lienzo.heigth = window.innerHeight / 2;
}

socket.on('connect', () => {
  console.log('Connected to server...');
});

// const res = fetch('http://localhost:3000/prueba')
//   .then((res) => {
//     return res.json();
//   })
//   .then((data) => {
//     console.log(data);
//   });

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
  // console.log(tweetData);

  // const tweetEl = document.createElement('div')
  tweetStream.className = 'card my-4';

  if (tweetData.image) {
    tweetStream.innerHTML = `
        <div class='card-body'>
          <img src=${tweetData.image}>
        </div>`;
  }

  // tweetStream.appendChild(tweetEl)
});

//Visualizacion

//// Sistema de coordenadas

async function crearCoordenadas() {
  const respuesta = await fetch('./covid19Parte.json');
  let datos = await respuesta.json();
  console.log(datos);
  const fechaInicial = datos[0].created_at;
  const fechaFinal = datos[10].created_at;
  console.log(fechaInicial);
  const tiempoMeses = calculoMeses(fechaInicial, fechaFinal);

  ctx.lineWidth = 1;
  ctx.font = '25px Arial';
  ctx.textAlign = 'start';
  ctx.strokeStyle = '#e9e9e9';
  ctx.fillStyle = 'black';

  //Eje X
  for (let i = 0; i <= tiempoMeses; i++) {
    const x = pasoMes * i + margenIzquierda;
    const mes = (inicio.getMonth() + i) % 15;

    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, base);
    ctx.stroke();
    ctx.fillText(mesATexto(mes), x - 15, baseTexto);
  }

  //Eje Y
  for (let i = 0; i <= pasoCasos * 4; i += pasoCasos) {
    const y = base - i * proporcionBase;
    ctx.beginPath();
    ctx.moveTo(margenIzquierda, y);
    ctx.lineTo(lienzo.width, y);
    ctx.stroke();
    ctx.fillText(i, margenIzquierda - 50, y + 8);
  }
}
