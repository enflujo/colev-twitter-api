import mongoose from 'mongoose';
import camposBasicosEsquema from '../modelos/camposBasicos.js';
import camposEncuestasEsquema from '../modelos/camposEncuestas.js';
import camposLugaresEsquema from '../modelos/camposLugares.js';
import camposMediosAdjuntosEsquema from '../modelos/camposMediosAdjuntos.js';
import camposUsuariosEsquema from '../modelos/camposUsuarios.js';
import entradaSchema from '../modelos/Tweet.js';
import { conector, logBloque } from '../utilidades/constantes.js';

const { MONGO_USER, MONGO_PASS } = process.env;
const rutaMongo = `mongodb://${MONGO_USER}:${MONGO_PASS}@localhost:27017`;
const conexion = mongoose.connection;

const coleccionTweets = mongoose.model('Tweet', entradaSchema);

const collectionCamposUsuarios = mongoose.model('camposUsuarios', camposUsuariosEsquema);
const collectionCamposMediosAdjuntos = mongoose.model('camposMediosAdjuntos', camposMediosAdjuntosEsquema);
const collectionCamposLugares = mongoose.model('camposLugares', camposLugaresEsquema);
const collectionCamposEncuestas = mongoose.model('camposEncuestas', camposEncuestasEsquema);

const colecciones = {
  basicos: mongoose.model('camposBasicos', camposBasicosEsquema),
};

async function conectar() {
  return new Promise((resolver, rechazar) => {
    mongoose.connect(rutaMongo, {
      dbName: 'colev',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    conexion.once('open', () => {
      console.log(`${conector} ${logBloque('Conectado a base de datos (Mongo)')}`);
      resolver();
    });

    conexion.on('error', (err) => {
      console.log(err);
    });
  });
}

// mc.once('open', async (req, res) => {
//   console.log('database connected to', MONGODB_URI);
//   // CSVParse();

//   const reglas = await twitter.v2.streamRules();
//   if (reglas.data?.length) {
//     await twitter.v2.updateStreamRules({
//       delete: { ids: reglas.data.map((rule) => rule.id) },
//     });
//   }

//   await twitter.v2.updateStreamRules({
//     add: palabrasClaves.covid19.map((palabra) => {
//       return { value: `(${palabra}) place_country:US` };
//     }),
//   });
// });

export {
  coleccionTweets,
  colecciones,
  collectionCamposUsuarios,
  collectionCamposMediosAdjuntos,
  collectionCamposLugares,
  collectionCamposEncuestas,
  conectar,
};
