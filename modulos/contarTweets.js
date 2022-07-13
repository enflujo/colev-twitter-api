import axios from 'axios';
import { gorila, logAviso, parametrosBase } from '../utilidades/constantes.js';

const instanciaConteo = axios.create({
  baseURL: 'https://api.twitter.com/2/tweets/counts',
  headers: {
    Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
  },
});

export default async () => {
  let contador = 0;

  console.log(`${gorila} ${logAviso('Contando tweets (este proceso puede ser demorado)')}`);

  async function peticion(pagina) {
    if (pagina) {
      parametrosBase.next_token = pagina;
    }

    try {
      const { data } = await instanciaConteo.get('/all', { params: parametrosBase });

      contador += data.meta.total_tweet_count;

      if (data.meta.next_token) {
        await peticion(data.meta.next_token);
      }
    } catch (error) {
      console.log(error);
    }
  }

  await peticion();

  return contador;
};
