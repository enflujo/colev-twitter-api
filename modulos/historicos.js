import axios from 'axios';
import { logError, parametrosBusqueda } from '../utilidades/constantes.js';
import { colecciones } from './baseDeDatos.js';

const instanciaAxios = axios.create({
  baseURL: 'https://api.twitter.com/2/tweets/search',
  headers: {
    Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
  },
});

async function peticion(pagina) {
  if (pagina) {
    parametrosBusqueda.next_token = pagina;
  }

  try {
    const { data } = await instanciaAxios.get(`/all`, { params: parametrosBusqueda });
    const { data: tweets, includes, meta } = data;

    try {
      const respuesta = await colecciones.basicos.bulkWrite(
        tweets.map((tweet) => ({
          updateOne: {
            filter: { _id: tweet.id },
            update: tweet,
            upsert: true,
          },
        }))
      );

      if (data.meta.next_token) {
        await peticion(meta.next_token);
      }
    } catch (error) {
      console.log('xxxxxxx', logError(error._message), 'xxxxxxxx');
      console.log(error);

      throw new Error();
    }

    /////////////////////Datos Basicos de los tweets
    // data.data.forEach((t) => {
    //   collectionCamposBasicos.insertMany(
    //     {
    //       attachments: t.attachments,
    //       author_id: t.author_id,
    //       context_annotations: t.context_annotations,
    //       conversation_id: t.conversation_id,
    //       created_at: t.created_at,
    //       entities: t.entities,
    //       geo: t.geo,
    //       id: t.id,
    //       in_reply_to_user_id: t.in_reply_to_user_id,
    //       lang: t.lang,
    //       possibly_sensitive: t.possibly_sensitive,
    //       public_metrics: t.public_metrics,
    //       referenced_tweets: t.referenced_tweets,
    //       reply_settings: t.reply_settings,
    //       source: t.source,
    //       text: t.text,
    //       withheld: t.withheld,
    //     },
    //     (err, resultado) => {
    //       if (err) console.log(err);
    //       if (resultado) {
    //         console.log('datos insertados desde el REST API para los campos basicos de los campos del tweet');
    //       }
    //     }
    //   );
    // });

    // // /////////////////Campos de medios adjuntos
    // data.includes.media.forEach((m) => {
    //   collectionCamposMediosAdjuntos.insertMany(
    //     {
    //       duration_ms: m.duration_ms,
    //       type: m.type,
    //       height: m.height,
    //       media_key: m.media_key,
    //       public_metrics: m.public_metrics,
    //       preview_image_url: m.preview_image_url,
    //       width: m.width,
    //       url: m.url,
    //       variants: m.variants,
    //     },
    //     (err, resultado) => {
    //       if (err) console.log(err);
    //       if (resultado) {
    //         console.log('datos insertados desde el REST API para el campo de medios adjuntos');
    //       }
    //     }
    //   );
    // });

    // // /////////////////Campos de usuarios
    // data.includes.users.forEach((u) => {
    //   collectionCamposUsuarios.insertMany(
    //     {
    //       id: u.id,
    //       name: u.name,
    //       username: u.username,
    //       created_at: u.created_at,
    //       description: u.description,
    //       entities: u.entities,
    //       location: u.location,
    //       pinned_tweet_id: u.pinned_tweet_id,
    //       profile_image_url: u.profile_image_url,
    //       protected: u.protected,
    //       public_metrics: u.public_metrics,
    //       url: u.url,
    //       verified: u.verified,
    //       withheld: u.withheld,
    //     },
    //     (err, resultado) => {
    //       if (err) console.log(err);
    //       if (resultado) {
    //         console.log('datos insertados desde el REST API para el campo de medios adjuntos');
    //       }
    //     }
    //   );
    // });

    // /////////////////////Campos Lugares
    // data.includes.place.forEach((l) => {
    //   collectionCamposLugares.insertMany(
    //     {
    //       geo: l.geo,
    //     },
    //     (err, resultado) => {
    //       if (err) console.log(err);
    //       if (resultado) {
    //         console.log('datos insertados desde el REST API para los campos basicos de los campos del tweet');
    //       }
    //     }
    //   );
    // });

    // /////////////////////Campos Encuestas
    // data.includes.poll.forEach((e) => {
    //   collectionCamposEncuestas.insertMany(
    //     {
    //       pool: e.pool,
    //     },
    //     (err, resultado) => {
    //       if (err) console.log(err);
    //       if (resultado) {
    //         console.log('datos insertados desde el REST API para los campos basicos de los campos del tweet');
    //       }
    //     }
    //   );
    // });

    // guardarJSON(data.data, './prueba-data');
    // guardarJSON(data.includes, './prueba-includes');
  } catch (err) {
    if (err.response && err.response.data && err.response.data.errors) {
      err.response.data.errors.forEach((error) => {
        console.log(error.message);
      });
    } else {
      console.log(err);
    }

    throw new Error();
  }
}

export default async () => {
  return await peticion();
};
