import { normalizarTexto, guardarJSON } from './utilidades/ayudas-servidor.js';
import fs from 'fs';
import { parse } from 'csv-parse';
// Importar JSON directamente al Mongodb

// const covidDatosJSON = JSON.parse(fs.readFileSync(__dirname + '/dist/datos/covid19.jsonl', 'utf-8'));

async function importarJsonDirectamente() {
  const flujo = fs.createReadStream(`${__dirname}/dist/datos/covid19.jsonl`);
  const procesador = json.parse();
  console.log('EMPEZANDO A CARGAR JSON');
  procesador.on('data', (tweet) => {
    console.log(tweet);
  });

  flujo.pipe(procesador);
  console.log('se mando a la tuberia');
  // where the data will end up
  // const outputDBConfig = {
  //   dbURL: `mongodb://${MONGO_USER}:${MONGO_PASS}@localhost:27017`,
  //   collection: 'entradaSchema',
  // };
  // // create the writable stream
  // const writableStream = streamToMongoDB(outputDBConfig);
  // // create readable stream and consume it
  // fs.createReadStream('/dist/datos/covid19.jsonl').pipe(JSONStream.parse('*')).pipe(writableStream);
  //
  // const pipeline = chain([
  //   fs.createReadStream('/dist/datos/covid19.jsonl'),
  //   parser(),
  //   pick({ filter: 'datos' }),
  //   ignore({ filter: /\b_meta\b/i }),
  //   streamValues(),
  //   (datos) => {
  //     const dato = datos;
  //     // keep data only for the accounting department
  //     return dato;
  //   },
  // ]);
  // let counter = 0;
  // pipeline.on('dato', () => ++counter);
  // pipeline.on('end', () => console.log('Se han guardado todos los datos'));
}

async function CSVParse() {
  const __dirname = dirname(fileURLToPath(import.meta.url));

  const processFile = async () => {
    let contador = 0;
    let tweetsGuardadosParser = [];
    const tweetsGuardadosParserLimit = 100;
    const parser = fs.createReadStream(`${__dirname}/dist/datos/covid19_string_parte.csv`).pipe(
      parse({
        delimiter: ',',
        trim: true,
        columns: true,
        encoding: 'utf8',
      })
    );
    for await (const fila of parser) {
      if (tweetsGuardadosParser.length <= tweetsGuardadosParserLimit) {
        // Work with each fila
        // console.log(fila);
        if (fila['attachments.media']) {
          fila['attachments.media'] = JSON.parse(fila['attachments.media']);
          // console.log(fila['attachments.media']);
        } else {
          fila['attachments.media'] = [];
        }
        if (fila.context_annotations) {
          fila.context_annotations = JSON.parse(fila.context_annotations);
          // console.log(fila['attachments.media']);
        } else {
          fila.context_annotations = [];
        }
        if (fila['entities.urls']) {
          fila['entities.urls'] = JSON.parse(fila['entities.urls']);
        } else {
          fila['entities.urls'] = [];
        }
        tweetsGuardadosParser.push(fila);
      } else {
        //cuando tweetsGuardadosParser es >= 100
        try {
          console.log('Guardando', contador);
          contador++;
          await coleccionTweets.insertMany(tweetsGuardadosParser); //guarda los tweets cuando llega a 100
          tweetsGuardadosParser = []; //desocupa tweetsGuardadosParser
        } catch (error) {
          console.log('ERROR GUARDANDO EN MONGO');
          throw new Error(error);
        }
      }
    }

    guardarJSON(palabrasGuardadas, 'tendencias');
  };

  (async () => {
    const tweetsGuardadosParser = await processFile();
    // console.info(`todos los tweetsGuardadosParser`, tweetsGuardadosParser);
  })();
}

async function tendencias() {
  let contador = 0;
  const palabrasGuardadas = [];
  const parser = fs.createReadStream(`${__dirname}/dist/datos/covid19_string.csv`).pipe(
    parse({
      delimiter: ',',
      trim: true,
      columns: true,
      encoding: 'utf8',
    })
  );
  for await (const fila of parser) {
    // console.log('procesando fila', contador);
    const texto = fila.text;
    const palabras = texto.split(' ');
    const fecha = fila.created_at;

    for (let i = 0; i < palabras.length; i++) {
      const palabraNormalizada = normalizarTexto(palabras[i]);
      if (palabraNormalizada.length < 3) continue;
      // Cualquier tipo de URL
      const regUrls =
        /(http:\/\/|ftp:\/\/|https:\/\/|www\.)([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?(\s|[0-9_]|([^a-zA-Z]+))/g;
      if (palabraNormalizada.match(regUrls)) continue;

      // Hashtags o Menciones con @
      if (palabraNormalizada.match(/([#@]+[a-zA-Z0-9(_)]{1,})/g)) continue;

      // Omitir estas palabras
      const regex =
        /\b(que|los|por|del|con|para|las|una|mas|esta|the|como|pero|and|este|hay|sin|nos|tiene|porque|sus|that|les|desde|per|covid-19|covid19|covid|2019-ncov|ncov|sars-cov-2|sarscov2|corona-virus|coronavirus)\b/g;
      if (palabraNormalizada.match(regex)) continue;

      const palabraI = palabrasGuardadas.findIndex((obj) => {
        return obj.palabraNormalizada === palabraNormalizada;
      });

      if (palabraI >= 0) {
        palabrasGuardadas[palabraI].fechas.push(fecha);
      } else {
        palabrasGuardadas.push({
          palabra: palabras[i],
          palabraNormalizada: palabraNormalizada,
          fechas: [fecha],
        });
      }
    }

    contador++;
  }
  try {
    guardarJSON(palabrasGuardadas, 'tendencias');
  } catch (error) {
    console.log(error);
  }
}
