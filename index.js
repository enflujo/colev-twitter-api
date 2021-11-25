require('dotenv/config');

const express = require('express');
const mongodb = require("mongodb").MongoClient;
const csvtojson = require("csvtojson");
const app = express();              
const port = 5000;    
const mongoose = require('mongoose');



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
mongoose.connect(url,
  { useNewUrlParser: true, useUnifiedTopology: true }).then((client) => {
    console.log('DB Connected!');
    dbConn = client.db();
  }).catch(err => {
    console.log(`DB Connection Error: ${err.message}`);
  });
// mongoose.connect(url,
  // { useNewUrlParser: true, useUnifiedTopology: true },
  // (err, client) => {
  //   if (err) throw err;
  // client
  
  //   console.log('Successfully connected');
    // const dB = client.db(process.env.DB_NAME); 
      
  

//----Enviar a MongoDB
function readCSV() {
  let count = 0;
  let arrayToMongo = [];
  csvtojson({delimiter:';'})
    .fromFile('./datos/cases.csv')
    .then((csvData) => {
      // console.log(csvData);
      csvData.forEach((row)=>
        {   
            count++;
            arrayToMongo.push(row);
            if(count % 100 == 0){
                count = 0;
                arrayToMongo = []; // clear the array
            }
        });
      let collectionName = 'forecast_cases';
      let collection = dbConn.collection(collectionName);
      collection.insertMany(arrayToMongo, (err, result) => {
        if (err) console.log(err);
        if (result) {
          console.log('Importación exitosa')
        }
      })
    });
    return arrayToMongo;
}
readCSV()

