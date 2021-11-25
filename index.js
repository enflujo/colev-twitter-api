require('dotenv/config');

const express = require('express');
const mongodb = require("mongodb").MongoClient;
const csvtojson = require("csvtojson");
const app = express();              
const port = 5000;    
const {connect, connection, model} = require('mongoose');
const PostSchema = require('./models/Post');

app.use(express.json());

//Importar rutas
const postRoute = require('./routes/posts');
// const { populate } = require('./models/Post');
app.use('/posts', postRoute);


//Server

app.get('/', (req, res) => {        
  res.sendFile('index.html', {root: __dirname});      
});

app.listen(port, () => {           
  console.log(`Now listening on port ${port}`); 
});



//DB connection

const url = process.env.DB_CONNECTION;
let dbConn;

connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

connection.once('open', () => {
  console.log('CONECTADO A BD');
  dbConn = model('Posts', PostSchema)

  readCSV();
})
connection.on('error', (error) => {
  console.log(error)
});

//----Enviar a MongoDB
function readCSV() {
  csvtojson({delimiter:','})
    .fromFile('./datos/cases.csv')
    .then((csvData) => {
      dbConn.insertMany(csvData, (err, result) => {
        if (err) console.log(err);

        if (result) {
          console.log(result);
        }
      })
    });
}


