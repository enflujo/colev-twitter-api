import './scss/estilos.scss';

const baseTally = 'http://localhost:3000';

async function extraerDatos() {
  const respuesta = await fetch(`${baseTally}/semana-horas`);
  const datos = await respuesta.json();
  datos.reverse();
  const agregados = [];

  datos.forEach((tweet) => {
    const fechaTweet = `${tweet.year}-${tweet.month}-${tweet.day}T${tweet.hour}:00:00`;
    let objI = agregados.findIndex((obj) => obj.fecha === fechaTweet);

    if (objI < 0) {
      agregados.push({ fecha: fechaTweet, conteo: 0 });
      objI = agregados.length - 1;
    }

    agregados[objI].conteo++;
  });

  const fechaInicial = agregados[0].fecha;
  const fechaFinal = agregados[agregados.length - 2].fecha;

  console.log(fechaInicial, fechaFinal, agregados);
}

extraerDatos();

// const conteo = document.getElementById('conteo');
// const historico = document.getElementById('historico');
// const mensaje = document.getElementById('mensaje');

// conteo.onclick = async () => {
//   mensaje.innerText = 'Contabilizando tweets ...';
//   const respuesta = await fetch(`${baseTally}/contar`);
//   const { totalTweets, fechaInicial, fechaFinal } = await respuesta.json();
//   mensaje.innerText = `En total hay ${totalTweets} desde ${fechaInicial} a ${fechaFinal}`;
// };

// historico.onclick = async () => {
//   const respuesta = await fetch(`${baseTally}/historicos`);
// };
