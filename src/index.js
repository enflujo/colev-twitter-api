import './scss/estilos.scss';

const baseTally = 'http://localhost:3000';
const conteo = document.getElementById('conteo');
const historico = document.getElementById('historico');
const mensaje = document.getElementById('mensaje');

conteo.onclick = async () => {
  mensaje.innerText = 'Contabilizando tweets ...';
  const respuesta = await fetch(`${baseTally}/contar`);
  const { totalTweets, fechaInicial, fechaFinal } = await respuesta.json();
  mensaje.innerText = `En total hay ${totalTweets} desde ${fechaInicial} a ${fechaFinal}`;
};

historico.onclick = async () => {};
