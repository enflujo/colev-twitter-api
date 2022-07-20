import colores from 'cli-color';
import emoji from 'node-emoji';
import palabrasClaves from '../modelos/palabrasClaves.js';

/**
 * Para usar otros colores, usar esta tabla para saber el número: https://robotmoon.com/256-colors/
 * Texto: xterm(40)
 * Fondo: bgXterm(40)
 */
export const logError = colores.red.bold;
export const logAviso = colores.bold.xterm(214);
export const logBloque = colores.bgCyan.black;
export const logCyan = colores.cyan.bold;
export const logVerde = colores.greenBright;
export const logNaranjaPulso = colores.xterm(214).blink;

// https://raw.githubusercontent.com/omnidan/node-emoji/master/lib/emoji.json
export const cadena = emoji.emojify(':link:');
export const conector = emoji.emojify(':electric_plug:');
export const gorila = emoji.emojify(':gorilla:');
export const chulo = emoji.emojify(':white_check_mark:');
export const PUERTO = process.env.TALLY_PUERTO || 3000;

const busqueda = palabrasClaves.covid19.join(' OR ');
/**
 * Fecha en formato ISO 8601
 */
// Un día antes del inicio de la pandemia (6 de marzo, 2020)
export const fechaInicial = new Date('05 March 2020 00:00 UTC').toISOString();
// Fecha actual menos 10 segundos (Twitter sólo acepta fecha final con 10 segundos de diferencia)
const hoy = Date.now() - 10 * 1000;
export const fechaFinal = new Date(hoy).toISOString();

export const parametrosBase = {
  query: `(${busqueda}) place_country:CO`,
  start_time: fechaInicial,
  end_time: fechaFinal,
};

export const parametrosBusqueda = {
  ...parametrosBase,
  max_results: 50,
  'tweet.fields':
    'attachments,author_id,context_annotations,conversation_id,created_at,entities,geo,id,in_reply_to_user_id,lang,possibly_sensitive,public_metrics,referenced_tweets,reply_settings,source,text,withheld',
  expansions:
    'attachments.media_keys,attachments.poll_ids,author_id,entities.mentions.username,geo.place_id,in_reply_to_user_id,referenced_tweets.id,referenced_tweets.id.author_id',
  'media.fields': 'media_key,duration_ms,height,preview_image_url,type,url,width,public_metrics,alt_text,variants',
};

// 22-02-01 4:25:07
// 2020-01-15 10:49:15
// 250954
