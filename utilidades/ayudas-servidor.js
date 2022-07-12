import { writeFileSync } from 'fs';

export const normalizarTexto = (texto) =>
  texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();

/**
 * Guardar datos localmente en archivo .json
 * @param {Object} json Datos que se quieren guardar en formato JSON.
 * @param {String} nombre Nombre del archivo, resulta en ${nombre}.json
 */
export const guardarJSON = (json, nombre) => {
  writeFileSync(`./dist/datos/${nombre}.json`, JSON.stringify(json, null, 2));
};
